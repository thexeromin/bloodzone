import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  Alert
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, ThemeColors } from "@/constants";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DUMMY FAQ DATA ---
const FAQS = [
  {
    id: 1,
    question: "How do I request blood?",
    answer:
      "Go to the Home tab and tap the '+' button. Fill out the request form with patient details and blood type needed. Your request will be broadcast to nearby donors."
  },
  {
    id: 2,
    question: "Is my personal data safe?",
    answer:
      "Yes. We prioritize your privacy. Your exact location is never shared publicly, and personal details are only visible to verified donors when you accept a connection."
  },
  {
    id: 3,
    question: "How do I verify my donor status?",
    answer:
      "Navigate to your Profile > Edit Profile and upload your latest donation certificate or medical ID. Our team will verify it within 24 hours."
  },
  {
    id: 4,
    question: "Can I chat with donors?",
    answer:
      "Yes! Once a donor accepts your request, a chat room is automatically created in your 'Chats' tab so you can coordinate safely."
  }
];

// Accordion Component
const AccordionItem = ({ item, expanded, onPress, noBorder = false }: any) => {
  return (
    <View
      style={[styles.accordionContainer, noBorder && { borderBottomWidth: 0 }]}
    >
      <TouchableOpacity
        style={[styles.accordionHeader]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{item.question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={ThemeColors.accent}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.accordionBody}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function HelpScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = () => {
    // In a real app: Linking.openURL('mailto:support@infinityhealth.com')
    Alert.alert(
      "Support Contacted",
      "This would open your email app to contact support@infinityhealth.com"
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Help & Support",
          headerStyle: { backgroundColor: ThemeColors.screenBackground },
          headerTintColor: ThemeColors.primaryContent,
          headerShadowVisible: false
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HERO SECTION --- */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-buoy" size={40} color={ThemeColors.accent} />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            Browse our FAQs or get in touch with our team directly.
          </Text>
        </View>

        {/* --- FAQ SECTION --- */}
        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              item={faq}
              expanded={expandedId === faq.id}
              noBorder={index === FAQS.length - 1 ? true : false}
              onPress={() => toggleExpand(faq.id)}
            />
          ))}
        </View>

        {/* --- CONTACT SECTION --- */}
        <Text style={styles.sectionHeader}>Still need help?</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Contact Support</Text>
            <Text style={styles.contactSubtitle}>
              Our team is available 24/7.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}
          >
            <Text style={styles.contactButtonText}>Email Us</Text>
          </TouchableOpacity>
        </View>

        {/* --- FOOTER LINKS --- */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => console.log("Website")}>
            <Text style={styles.linkText}>Visit Website</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>•</Text>
          <TouchableOpacity onPress={() => console.log("Twitter")}>
            <Text style={styles.linkText}>@InfinityHealth</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ThemeColors.surfaceBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    marginBottom: 8
  },
  heroSubtitle: {
    fontSize: 14,
    color: ThemeColors.secondaryContent,
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 20
  },

  // Headers
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: ThemeColors.secondaryContent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 5
  },

  // FAQ Accordion
  faqList: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: ThemeColors.surfaceBackground
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border || "rgba(255,255,255,0.05)"
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    color: ThemeColors.primaryContent,
    flex: 1,
    marginRight: 10
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  answerText: {
    fontSize: 14,
    color: ThemeColors.secondaryContent,
    lineHeight: 22
  },

  // Contact Card
  contactCard: {
    backgroundColor: ThemeColors.surfaceBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30
  },
  contactInfo: {
    flex: 1
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColors.primaryContent,
    marginBottom: 4
  },
  contactSubtitle: {
    fontSize: 12,
    color: ThemeColors.secondaryContent
  },
  contactButton: {
    backgroundColor: ThemeColors.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  contactButtonText: {
    color: Colors.neutral800,
    fontWeight: "600",
    fontSize: 14
  },

  // Footer
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  linkText: {
    color: ThemeColors.accent,
    fontSize: 14,
    fontWeight: "500"
  },
  dot: {
    color: ThemeColors.secondaryContent,
    marginHorizontal: 10
  }
});
