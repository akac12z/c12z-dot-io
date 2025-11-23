import { SECTION_LISTS } from "@basicPageComponents/home/section_lists/sectionLists";
import { getCollection } from "astro:content";

const libraryEntries = await getCollection("library");
const biasEntries = await getCollection("bias");

// Create a copy of SECTION_LISTS and update items
export let updatedSectionLists = SECTION_LISTS.map((section) => {
  if (section.label === "biblioteca") {
    const libraryItems = libraryEntries
      .filter((entry) => entry.data.backlog === "upload")
      .sort((a, b) => {
        const dateA = new Date(
          a.data.publishDate.split("/").reverse().join("-")
        );
        const dateB = new Date(
          b.data.publishDate.split("/").reverse().join("-")
        );
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4)
      .map((entry) => ({
        text: entry.data.title,
        href: `/biblioteca/${entry.id}`,
      }));
    return { ...section, items: libraryItems };
  } else if (section.label === "behavior") {
    const biasItems = biasEntries
      .filter((entry) => entry.data.backlog === "upload")
      .sort((a, b) => {
        const dateA = new Date(
          a.data.publishDate.split("/").reverse().join("-")
        );
        const dateB = new Date(
          b.data.publishDate.split("/").reverse().join("-")
        );
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4)
      .map((entry) => ({
        text: entry.data.biasName,
        href: `/${entry.collection}/${entry.id}`,
      }));
    return { ...section, items: biasItems };
  }
  return section;
});

// Add a new section for recent contents

updatedSectionLists = [...updatedSectionLists];
