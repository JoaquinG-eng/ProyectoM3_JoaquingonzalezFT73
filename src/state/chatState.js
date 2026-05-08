// Estado global — setCharacter vive SOLO aquí, no duplicar en otros archivos
export const chatState = {
  selectedCharacter: null,
  messages: []
};



export function setCharacter(character) {
  chatState.selectedCharacter = character;
  chatState.messages = [];
}