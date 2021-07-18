import createEmojiList from './emoji.js';

const $emojis = document.getElementById('emojis');
const $textarea = document.getElementById('emoji-input');
const $toggleEmoji = document.getElementById('toggle-emoji');

createEmojiList($emojis, $textarea);
$toggleEmoji.onclick = toggleEmoji;

function toggleEmoji() {
  $emojis.classList.toggle('on');
  document.querySelector('.emoji-item').focus();
}
