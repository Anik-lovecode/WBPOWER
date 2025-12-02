export const PAGE_MAP = {
  home: [
    {
      type: "Hero",
      props: { data: { title: "Welcome", subtitle: "Home page" } },
    },
    { type: "About", props: {} },
    { type: "ContactTable", props: {} },
    // {
    //   type: "contact_us",
    //   props: { data: { title: "Contact Page", subtitle: "Contact page" } },
    // },
  ],
   about_the_department: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],
   roles_responsibility: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   organization_structure: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   power_scenario_in_west_bengal: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

  acts: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],


   rules: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   policy: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   business_regulation: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

   whos_who: [
    { type: "NavNew", props: {} },
    
    { type: "OfficeInfo", props: {} },
    
    { type: "Footer", props: {} },
  ],

  contact_us: [
    { type: "NavNew", props: {} },
    { type: "ContactTable", props: {} },
    
    { type: "OfficeInfo", props: {} },
    { type: "MapSection", props: {} },
    { type: "Footer", props: {} },
  ],
  // default 404 / fallback:
  notfound: [{ type: "Hero", props: { data: { title: "Page not found" } } }],
};

export async function fetchPageConfig(slug) {
  // If you later support backend:
  // const res = await fetch(`/api/page-config/${slug}`);
  // return await res.json();

  // For now static:
  // alert("pagemap", PAGE_MAP[slug]);
  return PAGE_MAP[slug] ?? null;
}
