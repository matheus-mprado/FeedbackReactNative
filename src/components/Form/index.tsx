import { ArrowLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { captureScreen } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system'

import { Button } from '../Button';
import { ScreenshotButton } from '../ScreenshotButton';
import { FeedbackType } from '../Widget';

import { styles } from './styles';

import { api } from '../../libs/api';
import { feedbackTypes } from '../../utils/feedbackTypes';

import { theme } from '../../theme';

interface FormProps {
    feedbackType: FeedbackType
    onFeedbackCanceled: () => void;
    onFeedbackSent: () => void;
}

export function Form({ feedbackType, onFeedbackCanceled, onFeedbackSent }: FormProps) {
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [isSendingFeedback, setIsSendingFeedback] = useState(false)
    const [comment, setComment] = useState('')

    const feedbackTypeInfo = feedbackTypes[feedbackType]

    function handleScreenshot() {
        captureScreen({
            format: 'jpg',
            quality: 0.8
        })
            .then(uri => setScreenshot(uri))
            .catch(error => console.log(error))
    }

    function handleScreenshotRemove() {
        setScreenshot(null)
    }

    async function handleSendFeedback() {
        if (isSendingFeedback) {
            return
        }

        setIsSendingFeedback(true)

        const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' })

        try {
            await api.post('/feedbacks', {
                type: feedbackType,
                screenshot: `data:image/png;base64,${screenshotBase64}`,
                comment
            })

            onFeedbackSent()
        }
        catch (err) {
            console.log(err)
            setIsSendingFeedback(false)
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onFeedbackCanceled}
                >
                    <ArrowLeft
                        size={24}
                        weight="bold"
                        color={theme.colors.text_secondary}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Image
                        source={feedbackTypeInfo.image}
                        style={styles.image}
                    />
                    <Text style={styles.titleText}>
                        {feedbackTypeInfo.title}
                    </Text>

                </View>
            </View>

            <TextInput
                multiline
                style={styles.input}
                placeholder="Algo não esta funcionando bem? Queremos corrigir. Conte os detalhes o que está acontecendo!"
                placeholderTextColor={theme.colors.text_secondary}
                autoCorrect={false}
                onChangeText={setComment}
                

            />

            <View style={styles.footer}>
                <ScreenshotButton
                    onRemoveShot={handleScreenshotRemove}
                    onTakeShot={handleScreenshot}
                    screenshot={screenshot}
                />

                <Button
                    isLoading={isSendingFeedback}
                    disabled={!comment}
                    onPress={handleSendFeedback}
                />
            </View>
        </View>
    );
}