import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";

export default function CustomDropdown({ label, items, value, onSelect }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: value ? "#000" : "#888" }}>
          {value || "Seçiniz..."}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalBox}>
            <ScrollView style={{ maxHeight: 250 }}>
              {items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 2,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
