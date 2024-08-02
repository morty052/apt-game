import { Container } from 'components/ui/Container';
import { Colors } from 'constants/colors';
import { StyleSheet, Text, Pressable, View } from 'react-native';

const QuestCard = () => {
  return <Pressable style={styles.questCard} />;
};

export default function RoadMapScreen() {
  return (
    <Container style={styles.container}>
      <Text>RoadMap</Text>
      <QuestCard />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 5,
    gap: 20,
  },
  questCard: {
    width: '100%',
    height: 150,
    backgroundColor: 'red',
    elevation: 10,
    borderRadius: 10,
  },
});
