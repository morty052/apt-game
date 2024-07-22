import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '../../components/ui/Text';

function HelpItem({ title, description }: { title: string; description: string }) {
  return (
    <View
      style={{
        gap: 8,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: 'yellow',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 4,
      }}>
      <Text style={{ color: 'black', fontSize: 20 }}>{title}</Text>
      <Text style={{ color: 'black', fontSize: 15 }}>{description}</Text>
    </View>
  );
}

export default function HelpScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>How to play</Text>
          <HelpItem title="Animals" description="Learn which animals are allowed as answers" />
          <HelpItem title="Place" description="Learn what type of places are allowed as answers" />
          <HelpItem title="Thing" description="Learn what type of things are allowed as answers" />
          <HelpItem title="Wrong Answers" description="Learn how wrong answers are handled" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 20,
  },
  headerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
  },
});
