// ColorWithSaveControl.jsx
import React from 'react';

const ColorWithSaveControl = ({ name, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleSave = () => {
    const newColor = {
      label: name, // 또는 필요에 따라 별도의 prop 사용
      value,
    };
    const customColors = JSON.parse(localStorage.getItem('customColors')) || [];
    customColors.push(newColor);
    localStorage.setItem('customColors', JSON.stringify(customColors));
    alert(`'${name}' 컬러가 저장되었습니다.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 컬러 피커 */}
      <input
        type="color"
        value={value}
        onChange={handleChange}
        style={{ marginBottom: '4px' }}
      />
      {/* 컬러 저장 버튼 */}
      <button onClick={handleSave}>컬러 저장</button>
    </div>
  );
};

export default ColorWithSaveControl;
