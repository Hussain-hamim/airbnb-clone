import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Listings from '@/components/Listings';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface Props {
  listings: any[];
  category: string;
}

const ListingBottomSheet = ({ listings, category }: Props) => {
  const snapPoints = useMemo(() => ['25%', '60%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
    setRefresh(refresh + 1);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        width: 200,
        height: 200,
        // backgroundColor: 'red',
      }}
    >
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <Listings listings={listings} refresh={refresh} category={category} />
          <View style={styles.absoluteView}>
            <TouchableOpacity onPress={onShowMap} style={styles.btn}>
              <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>Map</Text>
              <Ionicons
                name='map'
                size={20}
                style={{ marginLeft: 10 }}
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  absoluteView: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sheetContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default ListingBottomSheet;
