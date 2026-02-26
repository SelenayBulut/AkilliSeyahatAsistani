import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
}

export default function MultiStepForm() {
  const [step, setStep] = useState<number>(1);

  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const progressPercent = (step / 3) * 100;

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    let newErrors: Partial<FormValues> = {};

    if (step === 1) {
      if (!values.fullName.trim()) {
        newErrors.fullName = "Ad ve Soyad boş bırakılamaz.";
      }
    }

    if (step === 2) {
      if (!values.email) {
        newErrors.email = "E-posta zorunludur.";
      } else if (!emailRegex.test(values.email)) {
        newErrors.email = "Geçerli bir e-posta giriniz.";
      }

      if (!values.phone) {
        newErrors.phone = "Telefon zorunludur.";
      } else if (!/^\d{10,11}$/.test(values.phone)) {
        newErrors.phone = "Telefon 10-11 haneli sayısal olmalıdır.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setValues({ fullName: "", email: "", phone: "" });
    setErrors({});
    setStep(1);
  };

  const handleSubmit = () => {
    alert("Form başarıyla gönderildi!\n" + JSON.stringify(values, null, 2));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Başlık */}
        <Text style={styles.title}>Çok Adımlı Form</Text>
        <Text style={styles.stepText}>Adım {step} / 3</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          %{Math.round(progressPercent)} tamamlandı
        </Text>

        {/* ---------- ADIM 1 ---------- */}
        {step === 1 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Ad ve Soyad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#9ca3af"
              value={values.fullName}
              onChangeText={(val) => handleChange("fullName", val)}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}
          </View>
        )}

        {/* ---------- ADIM 2 ---------- */}
        {step === 2 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@mail.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              value={values.email}
              onChangeText={(val) => handleChange("email", val)}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={[styles.label, { marginTop: 12 }]}>Telefon</Text>
            <TextInput
              style={styles.input}
              placeholder="10-11 haneli numara"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              value={values.phone}
              onChangeText={(val) => handleChange("phone", val)}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>
        )}

        {/* ---------- ADIM 3 (ÖZET) ---------- */}
        {step === 3 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.summaryTitle}>Özet</Text>

            <Text style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Ad Soyad: </Text>
              {values.fullName}
            </Text>

            <Text style={styles.summaryText}>
              <Text style={styles.summaryLabel}>E-posta: </Text>
              {values.email}
            </Text>

            <Text style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Telefon: </Text>
              {values.phone}
            </Text>
          </View>
        )}

        {/* ---------- BUTONLAR ---------- */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleReset} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Temizle</Text>
          </TouchableOpacity>

          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Geri</Text>
            </TouchableOpacity>
          )}

          {step < 3 ? (
            <TouchableOpacity onPress={handleNext} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>İleri</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSubmit} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Gönder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    backgroundColor: "#0f172a",
    flexGrow: 1,
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  stepText: {
    textAlign: "center",
    color: "#4b5563",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#a855f7",
  },
  progressLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  summaryLabel: {
    fontWeight: "700",
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "white",
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#111827",
  },
  primaryButton: {
    backgroundColor: "#a855f7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
