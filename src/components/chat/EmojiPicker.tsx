'use client';

import React, { useState } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');

  const emojiCategories = {
    smileys: {
      name: '😊 Smileys',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
        '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
        '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
        '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
      ],
    },
    gestures: {
      name: '👋 Gestures',
      emojis: [
        '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏',
        '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
        '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
        '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪',
      ],
    },
    hearts: {
      name: '❤️ Hearts',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
        '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
        '💘', '💝', '💟', '💌', '💋', '💏', '💑', '👩‍❤️‍👨',
      ],
    },
    animals: {
      name: '🐶 Animals',
      emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
        '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
        '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
      ],
    },
    food: {
      name: '🍕 Food',
      emojis: [
        '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇',
        '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
        '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽',
        '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞',
        '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇',
        '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟',
        '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘',
      ],
    },
    activities: {
      name: '⚽ Activities',
      emojis: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
        '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
        '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊',
        '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌', '🎿',
      ],
    },
    travel: {
      name: '✈️ Travel',
      emojis: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑',
        '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽',
        '🦼', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔',
        '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋',
        '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇',
        '🚊', '🚉', '✈️', '🛫', '🛬', '🛩', '💺', '🚁',
      ],
    },
    objects: {
      name: '💡 Objects',
      emojis: [
        '⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱',
        '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼',
        '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️',
        '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭',
        '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋',
        '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸',
      ],
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-w-[90vw] overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b bg-gradient-to-r from-blue-500 to-blue-600">
        <h3 className="text-sm font-semibold text-white">Choose an emoji</h3>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto bg-gray-50 border-b scrollbar-hide">
        {Object.entries(emojiCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            {category.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="text-2xl p-2 hover:bg-blue-50 rounded-lg transition-colors active:scale-95 transform"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 bg-gray-50 border-t text-center">
        <p className="text-xs text-gray-500">Click an emoji to add it</p>
      </div>
    </div>
  );
};

export default EmojiPicker;
