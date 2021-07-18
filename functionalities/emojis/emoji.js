const emoticons = [
  '&#128508;',
  '&#128509;',
  '&#128510;',
  '&#128511;',
  '&#128507;',
  '&#128512;',
  '&#128513;',
  '&#128514;',
  '&#128515;',
  '&#128516;',
  '&#128517;',
  '&#128518;',
  '&#128519;',
  '&#128520;',
  '&#128521;',
  '&#128522;',
  '&#128523;',
  '&#128524;',
  '&#128525;',
  '&#128526;',
  '&#128527;',
  '&#128528;',
  '&#128529;',
  '&#128530;',
  '&#128531;',
  '&#128532;',
  '&#128533;',
  '&#128534;',
  '&#128535;',
  '&#128536;',
  '&#128537;',
  '&#128538;',
  '&#128539;',
  '&#128540;',
  '&#128541;',
  '&#128542;',
  '&#128543;',
  '&#128544;',
  '&#128545;',
  '&#128546;',
  '&#128547;',
  '&#128548;',
  '&#128549;',
  '&#128550;',
  '&#128551;',
  '&#128552;',
  '&#128553;',
  '&#128554;',
  '&#128555;',
  '&#128556;',
  '&#128557;',
  '&#128558;',
  '&#128559;',
  '&#128560;',
  '&#128561;',
  '&#128562;',
  '&#128563;',
  '&#128564;',
  '&#128565;',
  '&#128566;',
  '&#128567;',
  '&#128577;',
  '&#128578;',
  '&#128579;',
  '&#128580;',
  '&#129296;',
  '&#129297;',
  '&#129298;',
  '&#129299;',
  '&#129300;',
  '&#129301;',
  '&#129312;',
  '&#129313;',
  '&#129314;',
  '&#129315;',
  '&#129316;',
  '&#129317;',
  '&#129319;',
  '&#129320;',
  '&#129321;',
  '&#129322;',
  '&#129323;',
  '&#129324;',
  '&#129325;',
  '&#129326;',
  '&#129327;',
  '&#129488;',
];

export default function createEmojiList(target, relatedTarget) {
  const $textarea = relatedTarget;
  const $emojisList = target;

  const keyListeners = {
    ArrowRight: function nextEmoticon(target) {
      target.nextElementSibling && target.nextElementSibling.focus();
    },
    ArrowLeft: function previousEmoticon(target) {
      target.previousElementSibling && target.previousElementSibling.focus();
    },
  };

  emoticons.forEach(renderEmoticon);
  $emojisList.addEventListener('click', handleEmoticonClick);
  $emojisList.addEventListener('keydown', handleEmoticonNavigationByKeys);

  function renderEmoticon(emoticon) {
    $emojisList.insertAdjacentHTML(
      'afterbegin',
      `
        <button class="emoji-item">${emoticon}</button>
      `
    );
  }

  function handleEmoticonClick(e) {
    if (!e.target.matches('.emoji-item')) return;
    const $emoticon = e.target;
    $textarea.focus();

    if (!('selectionStart' in $textarea))
      return ($textarea.value = $emoticon.textContent);

    const initialSelectionEnd = $textarea.selectionEnd + 2;

    let newValue = $emoticon.textContent;
    const firstStringSlice = $textarea.value.substring(
      0,
      $textarea.selectionStart
    );

    const lastStringSlice = $textarea.value.substring(
      $textarea.selectionEnd,
      $textarea.selectionEnd.length
    );

    newValue = firstStringSlice + newValue + lastStringSlice;

    $textarea.value = newValue;
    $textarea.selectionEnd = initialSelectionEnd;
    $emoticon.focus();
  }

  function handleEmoticonNavigationByKeys(e) {
    if (!(e.key in keyListeners)) return;
    keyListeners[e.key](e.explicitOriginalTarget);
  }
}
