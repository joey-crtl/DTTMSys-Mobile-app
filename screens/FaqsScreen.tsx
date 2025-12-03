import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'FaqsScreen'>;

const FaqsScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="light-content" backgroundColor="black" />
    
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('ProfileScreen', { user: 'Guest' })}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>FAQs</Text>
    </View>

    {/* FAQ Content */}
    <ScrollView style={styles.content}>

      <View style={styles.card}>
        <Text style={styles.q}>Q: What services do you offer?</Text>
        <Text style={styles.a}>A: We offer both local and international travel packages, visa assistance, flight and hotel booking, group tours, customized itineraries, and travel insurance coordination.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.q}>Q: How can I book a trip?</Text>
        <Text style={styles.a}>A: Booking is easy! Just send us: 1.Full names of all travelers (as shown in passport)2. Preferred travel dates and destination 3. Number of travelers. Our team will send your quotation and booking steps.</Text>
      </View>
            <View style={styles.card}>
        <Text style={styles.q}>Q: Can you customize itineraries?</Text>
        <Text style={styles.a}>A: Absolutely! We can personalize your itinerary according to your preferences, schedule, and budget — whether it’s a family getaway, honeymoon, or barkada trip.</Text>
      </View>
            <View style={styles.card}>
        <Text style={styles.q}>Q: Do you assist with visa applications?</Text>
        <Text style={styles.a}>A: Yes! We provide visa assistance for destinations like Japan, Korea, China, and more. We’ll guide you with requirements, forms, and tips to ensure a smooth process.</Text>
      </View>
            <View style={styles.card}>
        <Text style={styles.q}>Q: What happens if my trip gets canceled?</Text>
        <Text style={styles.a}>A: Cancellations are subject to airline and hotel policies. We’ll guide you through the process and help with rebooking options whenever possible.</Text>
      </View>
            <View style={styles.card}>
        <Text style={styles.q}>Q: Do you accommodate group or corporate travel?</Text>
        <Text style={styles.a}>A: Yes, we specialize in group bookings — perfect for company outings, educational tours, and family reunions. Large group packages may include a FREE tour guide!</Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
 header: {
  backgroundColor: "#228B73",
  paddingTop: 55,   // dagdagan para bumaba lahat
  paddingBottom: 20,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  alignItems: "center",
},

  backButton: { 
    position: 'absolute', 
    left: 16, 
    top: 50 // align with header padding
  },
  headerTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'center' 
  },
  content: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  q: { fontWeight: '700', fontSize: 16, color: '#000' },
  a: { marginTop: 6, color: '#555', fontSize: 15, lineHeight: 20 },
});

export default FaqsScreen;