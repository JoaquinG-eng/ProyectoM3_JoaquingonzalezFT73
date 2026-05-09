export const chatState = {
  selectedCharacter: null,
};

export function setCharacter(character) {
  chatState.selectedCharacter = character;
  sessionStorage.setItem("selectedCharacter", character.name);
}

export function restoreCharacter(characters) {
  const name = sessionStorage.getItem("selectedCharacter");
  if (!name) return null;
  const character = characters.find(c => c.name === name);
  if (character) chatState.selectedCharacter = character;
  return character || null;
}