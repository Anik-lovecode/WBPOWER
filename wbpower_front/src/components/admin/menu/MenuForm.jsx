import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

function MenuForm() {
  // Toggle optimistic updates here
  const useOptimistic = true;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      url: "",
      parent_id: "null",
    },
  });

  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch & normalize
  const normalizeTree = (items) =>
    items.map((item) => ({
      ...item,
      children: item.children_recursive ? normalizeTree(item.children_recursive) : [],
    }));

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    setLoadingMenus(true);
    try {
      const res = await api.get("/menu-list");
      const rawData = res.data.data || [];
      setMenus(normalizeTree(rawData));
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      setLoadingMenus(false);
    }
  }

  // flatten helper
  const flatten = (tree) => {
    const out = [];
    const walk = (nodes) => {
      nodes.forEach((n) => {
        out.push(n);
        if (n.children && n.children.length) walk(n.children);
      });
    };
    walk(tree);
    return out;
  };

  // collect descendant ids of a node
  const getDescendantIds = (tree, targetId) => {
    const ids = new Set();
    const findAndCollect = (nodes) => {
      for (const n of nodes) {
        if (n.id === targetId) {
          const collect = (children) => {
            children.forEach((c) => {
              ids.add(c.id);
              if (c.children && c.children.length) collect(c.children);
            });
          };
          if (n.children && n.children.length) collect(n.children);
          return true;
        }
        if (n.children && n.children.length) {
          if (findAndCollect(n.children)) return true;
        }
      }
      return false;
    };
    findAndCollect(tree);
    return Array.from(ids);
  };

  // tree update helpers
  const removeFromTree = (tree, idToRemove) => {
    return tree
      .map((node) => {
        if (node.id === idToRemove) return null;
        if (node.children && node.children.length) {
          return { ...node, children: removeFromTree(node.children, idToRemove) };
        }
        return node;
      })
      .filter(Boolean);
  };

  const findAndUpdateInTree = (tree, idToUpdate, updateFn) => {
    return tree.map((node) => {
      if (node.id === idToUpdate) {
        return updateFn(node);
      }
      if (node.children && node.children.length) {
        return { ...node, children: findAndUpdateInTree(node.children, idToUpdate, updateFn) };
      }
      return node;
    });
  };

  const insertNodeUnderParent = (tree, parentId, newNode) => {
    if (parentId === null || parentId === "null") {
      // add as top-level
      return [...tree, { ...newNode, children: newNode.children || [] }];
    }
    const insertRec = (nodes) =>
      nodes.map((n) => {
        if (n.id === parentId) {
          const children = n.children ? [...n.children, { ...newNode, children: newNode.children || [] }] : [{ ...newNode, children: [] }];
          return { ...n, children };
        }
        if (n.children && n.children.length) {
          return { ...n, children: insertRec(n.children) };
        }
        return n;
      });
    return insertRec(tree);
  };

  // Delete handler (keeps original confirm + API flow)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/deletemenu/${id}`);
      setMenus((prev) => removeFromTree(prev, id));
      if (editingId === id) {
        setEditingId(null);
        reset({ title: "", url: "", parent_id: "null" });
      }
      setMessage("Menu item deleted successfully!");
      setSuccess(true);
    } catch (err) {
      console.error("Delete failed", err);
      setMessage("Failed to delete menu item.");
      setSuccess(false);
    }
  };

  // Edit click: prefill, compute parent value as string
  const handleEditClick = (item) => {
    const parentValue = item.parent_id === null || item.parent_id === undefined ? "null" : String(item.parent_id);
    setEditingId(item.id);
    reset({ title: item.title || "", url: item.url || "", parent_id: parentValue });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit (create or update)
  const onSubmit = async (data) => {
    setMessage("");
    setSuccess(false);

    const payload = {
      title: data.title,
      url: data.url,
      parent_id: data.parent_id === "null" ? null : Number(data.parent_id),
    };

    // snapshot for fallback if not using full refetch
    const prevMenus = menus;

    // Optimistic branch
    if (useOptimistic) {
      if (editingId) {
        // optimistic update of the item locally
        setMenus((prev) =>
          findAndUpdateInTree(prev, editingId, (node) => ({
            ...node,
            title: payload.title,
            url: payload.url,
            parent_id: payload.parent_id,
          }))
        );
      } else {
        // optimistic create: temporary id (negative to avoid conflict)
        const tempId = -Date.now();
        const tempNode = { id: tempId, title: payload.title, url: payload.url, parent_id: payload.parent_id, children: [] };
        setMenus((prev) => insertNodeUnderParent(prev, payload.parent_id, tempNode));
      }
    }

    try {
      if (editingId) {
        // Update API - change method if your backend expects PATCH
        await api.put(`/menu/${editingId}`, payload);
      } else {
        // Create API - your original used PUT /menu for add
        const createRes = await api.put("/menu", payload);
        // If optimistic create used a temp node, reconcile server response (replace temp node with real one)
        if (useOptimistic && createRes?.data?.data) {
          const created = createRes.data.data;
          // replace the temp node (if any) with the created item; but best is to refetch authoritative list
          // We'll do a safe refetch to ensure tree structure matches server (keeps code simple)
        }
      }

      // On success: fetch to get authoritative structure (keeps ordering, IDs, children consistent)
      await fetchMenus();

      setMessage(editingId ? "Menu item updated successfully!" : "Menu item added successfully!");
      setSuccess(true);
      setEditingId(null);
      reset({ title: "", url: "", parent_id: "null" });
    } catch (error) {
      console.error("Error submitting menu:", error);
      setMessage("Error adding/updating menu.");
      setSuccess(false);

      // rollback: refetch authoritative list to recover from optimistic change
      await fetchMenus();

      // alternatively, we could setMenus(prevMenus) to revert snapshot, but refetch is safest
    }
  };

  if (loadingMenus) return <p>Loading menus...</p>;

  // Precompute descendant ids of editing item to disable as parent choices
  const disabledDescendantIds = editingId ? getDescendantIds(menus, editingId) : [];

  // render rows with buttons aligned in a flex group
  const renderMenuRows = (items, level = 0) => {
    return items.flatMap((item, index) => {
      const submenuBadge =
        level > 0 ? (
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              lineHeight: "20px",
              textAlign: "center",
              marginRight: 8,
              borderRadius: 3,
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontSize: 12,
              userSelect: "none",
            }}
          >
            {index + 1}
          </span>
        ) : null;

      return [
        <tr
          key={item.id}
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            fontSize: 14,
            color: "#111827",
          }}
        >
          <td
            style={{
              paddingLeft: level === 0 ? 36 : 36 + level * 28,
              verticalAlign: "middle",
              fontWeight: level === 0 ? "600" : "400",
              whiteSpace: "nowrap",
            }}
          >
            {submenuBadge}
            {item.title}
          </td>
          <td
            style={{
              padding: "12px",
              whiteSpace: "nowrap",
              color: "#4b5563",
            }}
          >
            {item.url}
          </td>
          <td
            style={{
              textAlign: "right",
              paddingRight: 36,
              verticalAlign: "middle",
            }}
          >
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => handleEditClick(item)}
                title="Edit menu"
                aria-label={`Edit ${item.title}`}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 4,
                  color: "#0ea5e9",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0284c7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0ea5e9")}
              >
                <FiEdit2 size={15} />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                title="Delete menu"
                aria-label={`Delete ${item.title}`}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 4,
                  color: "#ef4444",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ef4444")}
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          </td>
        </tr>,
        ...(item.children && item.children.length > 0 ? renderMenuRows(item.children, level + 1) : []),
      ];
    });
  };

  return (
    <div>
      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
        <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
          <h6 className="text-white text-capitalize ps-3">{editingId ? "Edit Menu" : "Menu"}</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans ">
        <div className="mb-3">
          <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
            Title
          </label>
          <input
            id="title-input"
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="block mb-1 font-medium text-gray-700">
            Url
          </label>
          <input
            {...register("url", { required: "URL required" })}
            placeholder="URL"
            className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="parent_menu" className="block mb-1 font-medium text-gray-700">
            Parent Menu
          </label>
          <select
            {...register("parent_id")}
            className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.parent_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="null">None (top-level menu)</option>
            {menus.map((item) => {
              // render options recursively
              const renderOption = (node, level = 0) => {
                const disabled =
                  editingId && (Number(node.id) === Number(editingId) || disabledDescendantIds.includes(node.id));
                return (
                  <React.Fragment key={node.id}>
                    <option value={node.id} disabled={disabled}>
                      {`${"— ".repeat(level)}${node.title}`}
                    </option>
                    {node.children && node.children.map((c) => renderOption(c, level + 1))}
                  </React.Fragment>
                );
              };
              return renderOption(item);
            })}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`p-head w-btn py-2 text-white font-semibold rounded-lg transition ${
              isSubmitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Saving..." : editingId ? "Update Menu" : "Add Menu"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                reset({ title: "", url: "", parent_id: "null" });
                setMessage("");
                setSuccess(false);
              }}
              className="py-2 px-3 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <p style={{ marginTop: 10, color: success ? "green" : "red", fontWeight: "600" }}>
          {message}
        </p>
      )}

      <div className="menu-list-container mt-6">
        <h6 className="text-white text-capitalize ps-3 bg-gradient-dark shadow-dark border-radius-lg py-2">Menu List</h6>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
            borderRadius: 20,
          }}
        >
          <thead
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
              fontWeight: "600",
              color: "#6b7280",
              textAlign: "left",
            }}
          >
            <tr>
              <th style={{ padding: "12px 16px" }}>Menu Title</th>
              <th style={{ padding: "12px 16px", width: "40%" }}>Link URL</th>
              <th style={{ padding: "12px 16px", width: 80, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>{renderMenuRows(menus)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuForm;
