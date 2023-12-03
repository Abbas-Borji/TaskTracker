export default function capitalizeFirstLetter(str: string | undefined) {
  if (!str) {
    return "";
  }

  const words = str.split(/\s+/); // Split the string by spaces
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
}
