import { useQuery } from '@tanstack/react-query';
import { Container } from 'components/ui/Container';
import { Colors } from 'constants/colors';
import { useSQLiteContext } from 'expo-sqlite/next';
import { StyleSheet, Pressable, View, Image } from 'react-native';
import { Text } from 'components/ui/Text';
import { useDB } from 'hooks/useDb';

type QuestProps = {
  Progress: number;
  Name: string;
  DESCRIPTION: string;
  IMAGE: string;
  ID: number;
};

const QuestCard = ({ quest }: { quest: QuestProps }) => {
  return (
    <Pressable style={styles.questCard}>
      <Image style={{ height: 120, width: 120 }} source={{ uri: quest.IMAGE }} />
      <View style={{ flex: 1 }}>
        <Text>{quest.Name}</Text>
        <Text style={{ fontSize: 12 }}>{quest.DESCRIPTION}</Text>
      </View>
    </Pressable>
  );
};

export default function RoadMapScreen() {
  const DB = useDB();
  const getQuests = async () => {
    try {
      const allRows = await DB.query.Nuggets.findMany({
        columns: {
          id: true,
          title: true,
          content: true,
          type: true,
          image: true,
        },
      });
      console.log({ allRows });
      return allRows;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['Quests'],
    queryFn: getQuests,
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container style={styles.container}>
      {data?.map((quest: any, index) => <Text>{quest.title}</Text>)}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 5,
    paddingTop: 10,
    gap: 20,
  },
  questCard: {
    width: '100%',
    height: 150,
    backgroundColor: 'red',
    elevation: 10,
    borderRadius: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
