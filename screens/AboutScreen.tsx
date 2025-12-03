// screens/AboutUsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const teamMembers = [
  {
    id: "1",
    name: "Kryshia Dean",
    role: "Manager",
    description:
      "With over 5 years of experience in global travel, I lead the team with a vision to make exploring the world simpler, more accessible, and more enjoyable for everyone.",
    image: require("../assets/DOC.jpg"),
  },
  {
    id: "2",
    name: "Jose Enrique Soliman",
    role: "Team Leader",
    description:
      "As a Lead Developer, I make sure every system runs smoothly by combining collaboration and technical expertise to deliver efficient travel solutions.",
    image: require("../assets/SOLI.jpg"),
  },
  {
    id: "3",
    name: "Kathlyn Leal",
    role: "Designer",
    description:
      "I’m passionate about creating visually engaging and user-friendly designs that make every travel experience more enjoyable and seamless",
    image: require("../assets/KATH.jpg"),
  },
  {
    id: "4",
    name: "Rogie Cabunas",
    role: "Documentation",
    description:
      "I focus on clarity and precision in every document I create, ensuring that system information is easy to understand and accessible to everyone.",
    image: require("../assets/GIE.jpg"),
  },
  {
    id: "5",
    name: "Jhon Lee Teofilo",
    role: "Developer",
    description:
      "A passionate developer dedicated to creating efficient, user-friendly systems that enhance travel experiences for everyone",
    image: require("../assets/LEE.jpg"),
  },
];

const AboutUsScreen = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Our Story */}
        <Text style={styles.sectionTitle}>Our Story</Text>

        <View style={styles.storyBlock}>
          <Image source={require("../assets/hp1.png")} style={styles.storyImage} />
          <View style={styles.storyText}>
            <Text style={styles.storyHeading}>Where It All Began</Text>
            <Text style={styles.storyDesc}>
              Doctor Travel & Tours started as a simple dream shared by a group of doctors 
              who found healing not only in medicine—but in travel. Before the pandemic, our 
              founders spent their free time exploring breathtaking destinations, 
              discovering the joy of new experiences, and realizing how travel can rejuvenate 
              both body and soul. This shared passion inspired the birth of 
              Doctor Travel & Tours—built on the belief that travel, like medicine, 
              can be the perfect remedy for life’s stresses.
            </Text>
          </View>
        </View>

        <View style={[styles.storyBlock, styles.reverse]}>
          <Image source={require("../assets/hp2.png")} style={styles.storyImage} />
          <View style={styles.storyText}>
            <Text style={styles.storyHeading}>Growing with Passion</Text>
            <Text style={styles.storyDesc}>
              When the pandemic struck, the world came to a standstill. 
              Flights were grounded, borders closed, and dreams were momentarily paused. 
              For us, it was a heartbreaking chapter. 
              Yet amid the uncertainty, our passion for travel never faded. 
              We used that time to strengthen our vision, improve our services, and 
              prepare for the day people could explore again—safely, comfortably, and confidently.
            </Text>
          </View>
        </View>

        <View style={styles.storyBlock}>
          <Image source={require("../assets/hp3.png")} style={styles.storyImage} />
          <View style={styles.storyText}>
            <Text style={styles.storyHeading}>Looking Ahead</Text>
            <Text style={styles.storyDesc}>
              Today, Doctor Travel & Tours stands stronger than ever. 
              What began as a group of doctors who love traveling has grown 
              into a dedicated team committed to crafting seamless, joy-filled adventures for everyone. 
              We continue to live by our promise—Your Rx for Adventure—because we believe that travel 
              remains one of life’s greatest medicines, bringing healing, happiness, and connection 
              wherever the journey leads.
            </Text>
          </View>
        </View>

        {/* Meet Our Team */}
        <Text style={styles.sectionTitle}>Meet Our Team</Text>
        {teamMembers.map((member) => (
        <TouchableOpacity
            key={member.id}
            style={styles.memberCardHorizontal}
            activeOpacity={0.8}
            onPress={() => toggleExpand(member.id)}
        >
            <Image source={member.image} style={styles.memberImageHorizontal} />
            <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
            {expandedId === member.id && (
                <Text style={styles.memberDesc}>{member.description}</Text>
            )}
            </View>
        </TouchableOpacity>
        ))}


        {/* Mission & Vision */}
        <Text style={styles.sectionTitle}>Mission & Vision</Text>
        <View style={styles.mvContainer}>
          <View style={styles.mvBox}>
            <Text style={styles.mvHeading}>Mission</Text>
            <Text style={styles.mvText}>
              At Doctor Travel & Tours, we believe travel is the best medicine—our 
              mission is to make every adventure easy, fun, and full of heartwarming memories.
            </Text>
          </View>
          <View style={styles.mvBox}>
            <Text style={styles.mvHeading}>Vision</Text>
            <Text style={styles.mvText}>
              To become a leading name in the travel industry by consistently providing excellence, 
              reliability, and inspiration in every journey we create.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#228B73",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  scrollContent: { padding: 16 },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 12, color: "#000" },

  // Story styles
  storyBlock: { flexDirection: "row", marginBottom: 20 },
  reverse: { flexDirection: "row-reverse" },
  storyImage: { width: 100, height: 100, borderRadius: 8 },
  storyText: { flex: 1, marginLeft: 12, marginRight: 12 },
  storyHeading: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  storyDesc: { fontSize: 14, color: "#444" },

    memberCardHorizontal: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    },
    memberImageHorizontal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
    },
    memberInfo: {
    flex: 1,
    },
    memberName: { fontSize: 14, fontWeight: "700" },
    memberRole: { fontSize: 12, color: "#777", marginBottom: 6 },
    memberDesc: { fontSize: 12, color: "#444" },


  // Mission & Vision
  mvContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  mvBox: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  mvHeading: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  mvText: { fontSize: 13, color: "#444" },
});
