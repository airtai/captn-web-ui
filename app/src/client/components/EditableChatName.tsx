import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { type Chat } from 'wasp/entities';

interface EditableChatNameProps {
  chat: Chat;
  onValueChange: (chatId: number, newValue: string) => void;
}

const EditableChatName: React.FC<EditableChatNameProps> = ({
  chat,
  onValueChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(
    chat.name ? `${chat.name}` : `New chat ${chat.id}`
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleIconClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onValueChange(chat.id, inputValue);
    setIsEditing(false);
  };

  const handleBlur = () => {
    onValueChange(chat.id, inputValue);
    setIsEditing(false);
  };

  return (
    <div className='editable-chat-name'>
      {!isEditing && inputValue}
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type='text'
            onChange={handleInputChange}
            onBlur={handleBlur}
            value={inputValue}
            className='w-5/6 focus:outline-none focus:ring-0 focus:border-captn-light-blue'
            style={{ height: '30px', paddingLeft: '5px', marginLeft: '-5px' }}
          />
        </form>
      )}
      {!isEditing && (
        <button
          className='edit-button absolute right-3 top-3 text-xs'
          onClick={handleIconClick}
        >
          <FaPencilAlt />
        </button>
      )}
    </div>
  );
};

export default EditableChatName;
