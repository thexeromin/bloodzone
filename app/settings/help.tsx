import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
  StatusBar
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

const FAQS = [
  {
    id: 1,
    question: "How do I request blood?",
    answer:
      "Go to the Search tab to find nearby donors or create a new request from your Dashboard. Your request will be broadcast to donors within a specific radius."
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
      "Navigate to your Profile > Edit Profile and upload your latest donation certificate. Our team will verify it within 24 hours."
  },
  {
    id: 4,
    question: "Can I chat with donors?",
    answer:
      "Yes! Once a donor accepts your request, a secure chat room is automatically created in your 'Messages' tab so you can coordinate safely."
  }
];

const AccordionItem = ({ item, expanded, onPress, noBorder = false }: any) => {
  return (
    <View
      style={[styles.accordionContainer, noBorder && { borderBottomWidth: 0 }]}
    >
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.questionText, expanded && styles.questionActive]}>
          {item.question}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={expanded ? Colors.primary : Colors.textSub}
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
    Alert.alert(
      "Support Contacted",
      "This would open your email app to contact support@infinityhealth.com"
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Stack.Screen
        options={{
          title: "Help & Support",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textMain,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 20 }
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-buoy" size={42} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            Browse our FAQs or get in touch with our team directly.
          </Text>
        </View>

        {/* Faq section */}
        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
        <View style={styles.faqCard}>
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              item={faq}
              expanded={expandedId === faq.id}
              noBorder={index === FAQS.length - 1}
              onPress={() => toggleExpand(faq.id)}
            />
          ))}
        </View>

        {/* Contact section */}
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
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>Email Us</Text>
          </TouchableOpacity>
        </View>

        {/* Footer links */}
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
    backgroundColor: Colors.background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },

  heroSection: {
    alignItems: "center",
    marginBottom: 35,
    marginTop: 10
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 8
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSub,
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 20
  },

  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSub,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 10
  },

  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)"
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMain,
    flex: 1,
    marginRight: 10
  },
  questionActive: {
    color: Colors.primary
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0
  },
  answerText: {
    fontSize: 14,
    color: Colors.textSub,
    lineHeight: 22
  },

  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  contactInfo: {
    flex: 1
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 4
  },
  contactSubtitle: {
    fontSize: 13,
    color: Colors.textMuted
  },
  contactButton: {
    backgroundColor: Colors.textMain,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13
  },

  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    opacity: 0.7
  },
  linkText: {
    color: Colors.textMain,
    fontSize: 13,
    fontWeight: "500"
  },
  dot: {
    color: Colors.textMuted,
    marginHorizontal: 10
  }
});
