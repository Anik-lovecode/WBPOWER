import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { FiTrash2, FiEdit2, FiChevronRight, FiChevronDown } from "react-icons/fi";

/**
 * MenuForm.jsx
 * - Adds Up/Down and Move (modal) controls for reordering menu items.
 * - Uses api.post('/menu/reorder', { items }) to sync ordering.
 */

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

  // Keep track of expanded nodes (collapsible)
  const [expanded, setExpanded] = useState(() => new Set());

  // Move modal state
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null); // item being moved
  const [moveParent, setMoveParent] = useState("null");
  const [movePosition, setMovePosition] = useState(null); // number or null

  const formRef = useRef(null);

  // Fetch & normalize
  const normalizeTree = (items) =>
    items.map((item) => ({
      ...item,
      children: item.children_recursive ? normalizeTree(item.children_recursive) : item.children || [],
    }));

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    setLoadingMenus(true);
    try {
      const res = await api.get("/menu-list");
      const rawData = res?.data?.data ?? res?.data ?? [];
      setMenus(normalizeTree(Array.isArray(rawData) ? rawData : []));
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

  // tree update helpers (remove/insert/move)
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

  // New: remove node by id and return removed node & new tree
  const removeNodeById = (tree, id) => {
    let removed = null;
    const walk = (nodes) =>
      nodes
        .map((n) => {
          if (n.id === id) {
            removed = { ...n, children: n.children || [] };
            return null;
          }
          if (n.children && n.children.length) {
            return { ...n, children: walk(n.children).filter(Boolean) };
          }
          return n;
        })
        .filter(Boolean);
    return { newTree: walk(tree), removed };
  };

  // New: insert node at specific index under parent
  const insertNodeAt = (tree, parentId, node, position = null) => {
    if (parentId === null || parentId === "null") {
      const copy = [...tree];
      if (position === null || position >= copy.length) copy.push(node);
      else copy.splice(position, 0, node);
      return copy;
    }
    const walk = (nodes) =>
      nodes.map((n) => {
        if (n.id === parentId) {
          const children = n.children ? [...n.children] : [];
          if (position === null || position >= children.length) children.push(node);
          else children.splice(position, 0, node);
          return { ...n, children };
        }
        if (n.children && n.children.length) {
          return { ...n, children: walk(n.children) };
        }
        return n;
      });
    return walk(tree);
  };

  // New: move node (remove then insert)
  const moveNode = (tree, id, newParentId, newPosition = null) => {
    const { newTree, removed } = removeNodeById(tree, id);
    if (!removed) return tree; // not found
    // keep removed.children as is (move subtree)
    return insertNodeAt(newTree, newParentId, removed, newPosition);
  };

  // helper to replace the temporary node (tempId negative) with server created node
  const replaceTempNode = (tree, tempId, createdNode) => {
    const replaceRec = (nodes) =>
      nodes.map((n) => {
        if (n.id === tempId) {
          return { ...createdNode, children: n.children || createdNode.children || [] };
        }
        if (n.children && n.children.length) {
          return { ...n, children: replaceRec(n.children) };
        }
        return n;
      });
    return replaceRec(tree);
  };

  // helper: get children array for a given parent id from tree (returns reference-copy)
  const getChildrenByParentId = (tree, parentId) => {
    if (parentId === null || parentId === "null") return tree;
    let found = null;
    const walk = (nodes) => {
      for (const n of nodes) {
        if (n.id === parentId) {
          found = n.children || [];
          return true;
        }
        if (n.children && n.children.length) {
          if (walk(n.children)) return true;
        }
      }
      return false;
    };
    walk(tree);
    return found || [];
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

  // Edit click: prefill, compute parent value as string, and scroll to formRef
  const handleEditClick = (item) => {
    const parentValue = item.parent_id === null || item.parent_id === undefined ? "null" : String(item.parent_id);
    setEditingId(item.id);
    reset({ title: item.title || "", url: item.url || "", parent_id: parentValue });

    // ensure the form is visible — smooth scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // also focus first input a bit later for keyboard users
      setTimeout(() => {
        const el = formRef.current.querySelector("#title-input");
        if (el) el.focus();
      }, 450);
    } else {
      // fallback
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        // optimistic update of the item locally (in-place: keeps order)
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
        const res = await api.put(`/menu/${editingId}`, payload);

        // IMPORTANT: don't refetch full list on update to preserve UI order.
        // Instead, reconcile using server response if it returned updated object.
        if (res?.data?.data) {
          const updated = res.data.data;
          setMenus((prev) =>
            findAndUpdateInTree(prev, editingId, (node) => ({
              ...node,
              title: updated.title ?? payload.title,
              url: updated.url ?? payload.url,
              parent_id: updated.parent_id ?? payload.parent_id,
            }))
          );
        }

        setMessage("Menu item updated successfully!");
        setSuccess(true);
        setEditingId(null);
        reset({ title: "", url: "", parent_id: "null" });
      } else {
        // Create API - your original used PUT /menu for add
        const createRes = await api.put("/menu", payload);
        const created = createRes?.data?.data;

        if (created) {
          // if we used a temp node, replace it with the created item
          setMenus((prev) => {
            // find if a temp node with negative id exists matching title/url/parent
            const firstTemp = (function findTemp(nodes) {
              for (const n of nodes) {
                if (n.id < 0 && n.title === payload.title && (n.parent_id === payload.parent_id || String(n.parent_id) === String(payload.parent_id))) {
                  return n.id;
                }
                if (n.children && n.children.length) {
                  const found = findTemp(n.children);
                  if (found) return found;
                }
              }
              return null;
            })(prev);

            if (firstTemp) {
              return replaceTempNode(prev, firstTemp, { ...created, children: created.children || [] });
            }

            // fallback: insert created node under parent (appended)
            return insertNodeUnderParent(prev, created.parent_id, { ...created, children: created.children || [] });
          });
        } else {
          // if server didn't return created item, fetch authoritative list
          await fetchMenus();
        }

        setMessage("Menu item added successfully!");
        setSuccess(true);
        reset({ title: "", url: "", parent_id: "null" });
      }
    } catch (error) {
      console.error("Error submitting menu:", error);
      setMessage("Error adding/updating menu.");
      setSuccess(false);

      // rollback: refetch authoritative list to recover from optimistic change
      await fetchMenus();
    }
  };

  if (loadingMenus) return <p>Loading menus...</p>;

  // Precompute descendant ids of editing item to disable as parent choices
  const disabledDescendantIds = editingId ? getDescendantIds(menus, editingId) : [];

  // Expand/collapse toggling
  const isExpanded = (id) => expanded.has(id);
  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  // ====== Reordering handlers (Up/Down + Move modal) ======

  // find parent id and index of a node
  const findParentAndIndex = (tree, id, parentId = null) => {
    for (let i = 0; i < tree.length; i++) {
      const n = tree[i];
      if (n.id === id) return { parentId, index: i };
      if (n.children && n.children.length) {
        const res = findParentAndIndex(n.children, id, n.id);
        if (res) return res;
      }
    }
    return null;
  };

  // Build the payload array for server bulk reorder from sibling array
  const buildReorderPayload = (siblings, parentId) =>
    siblings.map((s, idx) => ({ id: s.id, parent_id: parentId === "null" ? null : parentId, position: idx }));

  // Up: move item one position up among siblings
  const handleMoveUp = async (id) => {
    const loc = findParentAndIndex(menus, id);
    if (!loc) return;
    const { parentId, index } = loc;
    if (index === 0) return; // already first

    // local move
    const newTree = moveNode(menus, id, parentId, index - 1);
    setMenus(newTree);

    // sync affected siblings under parentId
    const siblings = getChildrenByParentId(newTree, parentId);
    const payload = buildReorderPayload(siblings, parentId);
    try {
      await api.post("/menu/reorder", { items: payload });
    } catch (err) {
      console.error("Reorder failed, refetching", err);
      await fetchMenus();
    }
  };

  // Down: move item one position down among siblings
  const handleMoveDown = async (id) => {
    const loc = findParentAndIndex(menus, id);
    if (!loc) return;
    const { parentId, index } = loc;
    const siblingsBefore = getChildrenByParentId(menus, parentId);
    if (index >= siblingsBefore.length - 1) return; // already last

    // local move
    const newTree = moveNode(menus, id, parentId, index + 1);
    setMenus(newTree);

    // sync affected siblings under parentId
    const siblings = getChildrenByParentId(newTree, parentId);
    const payload = buildReorderPayload(siblings, parentId);
    try {
      await api.post("/menu/reorder", { items: payload });
    } catch (err) {
      console.error("Reorder failed, refetching", err);
      await fetchMenus();
    }
  };

  // Open move modal: prefill parent and suggested position
  const openMoveModal = (item) => {
    setMoveTarget(item);
    const loc = findParentAndIndex(menus, item.id);
    const parentId = (loc && loc.parentId) || "null";
    setMoveParent(parentId === null ? "null" : parentId);
    const siblings = getChildrenByParentId(menus, parentId);
    const currentIndex = loc ? loc.index : siblings.length;
    setMovePosition(currentIndex);
    setMoveModalOpen(true);
  };

  // Confirm move from modal: apply local move and sync (bulk reorder)
  const handleMoveConfirm = async () => {
    if (!moveTarget) return setMoveModalOpen(false);
    const id = moveTarget.id;
    const targetParentId = moveParent === "null" ? null : Number(moveParent);
    const targetPos = movePosition === "" || movePosition === null ? null : Number(movePosition);

    // local move
    const newTree = moveNode(menus, id, targetParentId, targetPos);
    setMenus(newTree);
    setMoveModalOpen(false);
    setMoveTarget(null);

    // sync siblings under the target parent and also siblings under the old parent (if different)
    // Build payloads for both affected parents
    const affectedParentIds = new Set();
    affectedParentIds.add(targetParentId === null ? "null" : String(targetParentId));
    // old parent
    const oldLoc = findParentAndIndex(menus, id);
    const oldParentId = oldLoc ? oldLoc.parentId : null;
    affectedParentIds.add(oldParentId === null ? "null" : String(oldParentId));

    // For each affected parent compute siblings and add to bulk payload
    let bulk = [];
    for (const pid of Array.from(affectedParentIds)) {
      const pIdVal = pid === "null" ? null : Number(pid);
      const siblings = getChildrenByParentId(newTree, pIdVal);
      if (siblings && siblings.length) {
        bulk = bulk.concat(buildReorderPayload(siblings, pid === "null" ? "null" : Number(pid)));
      }
    }

    try {
      await api.post("/menu/reorder", { items: bulk });
    } catch (err) {
      console.error("Move reorder failed, refetching", err);
      await fetchMenus();
    }
  };

  // Cancel modal
  const handleMoveCancel = () => {
    setMoveModalOpen(false);
    setMoveTarget(null);
  };

  // render rows with collapsible children
  const renderMenuRows = (items, level = 0) => {
    return items.flatMap((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const key = item.id ?? `${item.title}-${level}-${index}`;
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
            aria-hidden
          >
            {index + 1}
          </span>
        ) : null;

      const row = (
        <tr
          key={key}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  aria-expanded={isExpanded(item.id)}
                  aria-label={`${isExpanded(item.id) ? "Collapse" : "Expand"} ${item.title}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#6b7280",
                  }}
                >
                  {isExpanded(item.id) ? <FiChevronDown /> : <FiChevronRight />}
                </button>
              ) : (
                // preserve spacing so titles align
                <span style={{ width: 28, display: "inline-block" }} />
              )}

              {submenuBadge}
              <span>{item.title}</span>
            </div>
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
              {/* Move controls: Up, Down, Move */}
              <button
                onClick={() => handleMoveUp(item.id)}
                title="Move up"
                aria-label={`Move up ${item.title}`}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 4,
                }}
              >
                ▲
              </button>

              <button
                onClick={() => handleMoveDown(item.id)}
                title="Move down"
                aria-label={`Move down ${item.title}`}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 4,
                }}
              >
                ▼
              </button>

              <button
                onClick={() => openMoveModal(item)}
                title="Move"
                aria-label={`Move ${item.title}`}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 4,
                }}
              >
                Move
              </button>

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
        </tr>
      );

      const childrenRows =
        hasChildren && isExpanded(item.id) ? renderMenuRows(item.children, level + 1) : [];

      return [row, ...childrenRows];
    });
  };

  // render parent options for move modal/select
  const renderParentOptions = (nodes, level = 0) =>
    nodes.flatMap((n) => {
      const label = `${"— ".repeat(level)}${n.title}`;
      return [
        <option value={n.id} key={n.id}>
          {label}
        </option>,
        ...(n.children && n.children.length ? renderParentOptions(n.children, level + 1) : []),
      ];
    });

  return (
    <div>
      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
        <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
          <h6 className="text-white text-capitalize ps-3">{editingId ? "Edit Menu" : "Menu"}</h6>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans "
      >
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
        <p style={{ marginTop: 10, color: success ? "green" : "red", fontWeight: "600" }}>{message}</p>
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
              <th style={{ padding: "12px 16px", width: 180, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>{renderMenuRows(menus)}</tbody>
        </table>
      </div>

      {/* Move Modal */}
      {moveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.35)",
            zIndex: 1200,
          }}
        >
          <div style={{ width: 520, background: "white", borderRadius: 8, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            <h4 style={{ margin: 0, marginBottom: 12 }}>Move "{moveTarget?.title}"</h4>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", marginBottom: 6 }}>New Parent</label>
              <select value={moveParent} onChange={(e) => setMoveParent(e.target.value)} style={{ width: "100%", padding: 8 }}>
                <option value="null">-- None (top level) --</option>
                {renderParentOptions(menus)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Position (0-based index)</label>
              <input
                type="number"
                min={0}
                placeholder="position (e.g. 0 to insert at top)"
                value={movePosition === null ? "" : String(movePosition)}
                onChange={(e) => setMovePosition(e.target.value === "" ? null : Number(e.target.value))}
                style={{ width: "100%", padding: 8 }}
              />
              <small style={{ color: "#6b7280" }}>
                If left blank the item will be appended at the end.
              </small>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={handleMoveCancel} style={{ padding: "8px 12px", borderRadius: 6, background: "#f3f4f6", border: "none" }}>
                Cancel
              </button>
              <button
                onClick={handleMoveConfirm}
                style={{ padding: "8px 12px", borderRadius: 6, background: "#111827", color: "white", border: "none" }}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuForm;
