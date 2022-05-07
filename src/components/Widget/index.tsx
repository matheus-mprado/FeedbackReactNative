import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ChatTeardropDots } from 'phosphor-react-native'
import BottomSheet from '@gorhom/bottom-sheet'

import { Options } from '../Options';

import { theme } from '../../theme';

import { styles } from './styles';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { Form } from '../Form';
import { Success } from '../Success';


export type FeedbackType = keyof typeof feedbackTypes

function Widget() {

    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)
    const [feedbackSent, setFeedbackSent] = useState(false)

    const bottomSheetRef = useRef<BottomSheet>(null)

    function handleOpen() {
        bottomSheetRef.current?.expand()
    }

    function handleRestartFeedback() {
        setFeedbackType(null);
        setFeedbackSent(false)
    }

    function handleFeedbackSent(){
        setFeedbackSent(true)
    }

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={handleOpen}
            >
                <ChatTeardropDots
                    size={24}
                    color={theme.colors.text_on_brand_color}
                    weight="bold"
                />
            </TouchableOpacity>

            <BottomSheet
                snapPoints={[1, 280]}
                ref={bottomSheetRef}
                backgroundStyle={styles.modal}
                handleIndicatorStyle={styles.indicator}
            >
                {
                    feedbackSent ?
                        <Success 
                            onSendAnotherFeedback={handleRestartFeedback}
                        />
                        :
                        <>
                            {feedbackType ?
                                <Form
                                    feedbackType={feedbackType}
                                    onFeedbackCanceled={handleRestartFeedback}
                                    onFeedbackSent={handleFeedbackSent}
                                />
                                :
                                <Options
                                    onFeedbackTypeChanged={setFeedbackType}
                                />
                            }
                        </>
                }
            </BottomSheet>
        </>
    );
}

export default gestureHandlerRootHOC(Widget)