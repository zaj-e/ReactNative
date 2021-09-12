import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import withPreventDoubleClick from '../hoc/withPreventDoubleClick';
import {ConfirmModalProps} from './ConfirmModal';

const ButtonDebounce: any = withPreventDoubleClick(TouchableOpacity);

export const NotLoggedInModal: React.FC<
  ConfirmModalProps & {bodyText: string}
> = ({
  bodyText,
  isVisible,
  backdropOpacity,
  titleText,
  closeModal,
  performAction,
}) => {
  return (
    <Modal
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      backdropOpacity={backdropOpacity}
      isVisible={isVisible}>
      <View
        style={{
          width: '90%',
          backgroundColor: 'white',
          padding: 16,
          height: '40%',
          paddingBottom: 15,
          minHeight: '20%',
          alignSelf: 'center'
        }}>
        <Text style={styles.titleStyle}>{titleText}</Text>
        <Text style={styles.bodyModalText}>{bodyText}</Text>
        <View style={styles.buttonContainer}>
          <ButtonDebounce onPress={performAction}>
            <Text style={styles.buttonTextStyle}>Aceptar</Text>
          </ButtonDebounce>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bodyModalText: {
    alignSelf: 'flex-start',
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    alignSelf: 'flex-end',
    marginTop: 50
  },
  buttonTextStyle: {
    fontSize: 18,
    color: 'blue',
    padding: 5,
    width: 100,
    textAlign: 'center',
   
  },
});
