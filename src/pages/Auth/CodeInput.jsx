import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

/**
 * light: koyu temayı yok sayar (giriş ekranı her zaman açık renk)
 */
const CodeInput = forwardRef(({ value, onChange, length = 6, autoFocus, disabled, error, onComplete, light }, ref) => {

  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }));

  const handleChange = (text) => {
    const next = text.replace(/\D/g, '').slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const boxClass = (i) => {

    const active = !disabled && i === Math.min(value.length, length - 1);

    if (error) return light ? 'border-red-300 bg-red-50' : 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
    if (active) return light ? 'border-blue-500 bg-white' : 'border-blue-500 bg-white dark:bg-gray-800';
    return light ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/60';
  };

  return (

    <Pressable onPress={() => inputRef.current?.focus()} disabled={disabled}>

      <View className="flex-row justify-between" style={{ gap: 8 }}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} className={`flex-1 rounded-xl items-center justify-center border-2 ${boxClass(i)}`} style={{ height: 56, maxWidth: 52, opacity: disabled ? 0.6 : 1 }}>
            <Text className={`text-2xl font-black ${light ? 'text-gray-900' : 'text-gray-900 dark:text-white'}`}>{value[i] ?? ''}</Text>
          </View>
        ))}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        editable={!disabled}
        caretHidden
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}
      />

    </Pressable>
  );
});

export default CodeInput;
