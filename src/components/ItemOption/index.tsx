import React from 'react';
import { TouchableOpacity,TouchableOpacityProps, Image, ImageProps, Text } from 'react-native';

import { styles } from './styles';

interface ItemOptionProps extends TouchableOpacityProps{
    title:string;
    image: ImageProps
}

export function ItemOption({title,image,...rest}:ItemOptionProps) {
  return (
    <TouchableOpacity 
        style={styles.container}
        {...rest}
    >
        <Image 
            source={image}
            style={styles.image}
        />
        <Text
            style={styles.text}
        >
            {title}
        </Text>
    </TouchableOpacity>
  );
}