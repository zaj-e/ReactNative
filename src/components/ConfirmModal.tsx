import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

export interface ConfirmModalProps {
  isVisible: boolean;
  backdropOpacity: number;
  titleText: string;
  closeModal: () => void;
  performAction: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
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
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 16,
          paddingBottom: 15,
          minHeight: '20%',
        }}>
        <Text style={styles.titleStyle}>{titleText}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={performAction}>
            <Text style={styles.buttonTextStyle}>Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.buttonTextStyle}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 100,
      paddingTop: 20,
  },
  buttonTextStyle: {
    fontSize: 18,
    backgroundColor: '#C6C6C6',
    padding: 5,
    width: 50,
    textAlign: 'center',
    borderRadius: 5
  }
});
