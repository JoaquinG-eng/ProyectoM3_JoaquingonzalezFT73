export const chatState = {
  selectedCharacter: null,
  messages: []
};

export function setCharacter(character) {
  chatState.selectedCharacter = character;
  chatState.messages = [];
}