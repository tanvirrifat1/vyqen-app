import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Placeholder } from '@/components/vyqen/parts';
import { formatPrice, getProduct, V, type Detail } from '@/constants/vyqen';
import { useBag } from '@/store/bag';
import { useFavorites } from '@/store/favorites';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

function Row({ item }: { item: Detail }) {
  const { add } = useBag();
  const { remove } = useFavorites();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add({ id: item.id, name: item.name, price: item.price, tint: item.gallery[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Pressable onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} style={s.row}>
      <Placeholder tint={item.gallery[0]} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <View style={s.rowTop}>
          <Text style={s.cat} numberOfLines={1}>{item.category}</Text>
          <Pressable onPress={() => remove(item.id)} hitSlop={10} style={s.heartBtn}>
            <Icon name="heart" size={16} color={V.orange} />
          </Pressable>
        </View>
        <Text style={s.name} numberOfLines={2}>{item.name}</Text>
        <Text style={s.maker} numberOfLines={1}>by {item.maker}</Text>
        <View style={s.priceRow}>
          <Text style={s.price}>{formatPrice(item.price)}</Text>
          {item.oldPrice ? <Text style={s.oldPrice}>{formatPrice(item.oldPrice)}</Text> : null}
        </View>
        <View style={s.rowBottom}>
          <View style={s.rating}>
            <Icon name="star" size={11} color={V.amber} />
            <Text style={s.ratingText}>{item.rating.toFixed(1)} ({item.reviews})</Text>
          </View>
          <Pressable onPress={onAdd} style={[s.addBtn, added && s.addBtnOn]}>
            <Icon name={added ? 'check' : 'shopping-outline'} size={13} color={added ? '#fff' : V.amber} />
            <Text style={[s.addText, added && { color: '#fff' }]}>{added ? 'Added' : 'Add to Bag'}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function FavoritesScreen() {
  const { ids } = useFavorites();
  const { add } = useBag();
  const [allAdded, setAllAdded] = useState(false);

  const items = ids.map((id) => getProduct(id)).filter((x): x is Detail => !!x);

  const addAll = () => {
    items.forEach((i) => add({ id: i.id, name: i.name, price: i.price, tint: i.gallery[0] }));
    setAllAdded(true);
    setTimeout(() => setAllAdded(false), 1500);
  };

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#2a1408', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.header}>
          <View style={s.hIcon}>
            <Icon name="heart" size={20} color={V.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.hTitle}>Your Favorites</Text>
            <Text style={s.hSub}>
              {items.length} saved {items.length === 1 ? 'piece' : 'pieces'}
            </Text>
          </View>
          <Pressable onPress={goBack} hitSlop={10}>
            <Icon name="close" size={22} color={V.muted} />
          </Pressable>
        </View>

        {items.length === 0 ? (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Icon name="heart-outline" size={36} color={V.dim} />
            </View>
            <Text style={s.emptyTitle}>No favorites yet</Text>
            <Text style={s.emptySub}>Tap the heart on any luminaire or 3D stand to save it here for later.</Text>
            <Pressable
              onPress={() => {
                goBack();
                router.navigate('/collection');
              }}
              style={s.ghost}>
              <Text style={s.ghostText}>EXPLORE COLLECTION</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} showsVerticalScrollIndicator={false}>
              {items.map((it) => (
                <Row key={it.id} item={it} />
              ))}
            </ScrollView>
            <View style={s.footer}>
              <Pressable onPress={addAll} style={({ pressed }) => pressed && { opacity: 0.88 }}>
                <LinearGradient colors={[V.orange, '#e8780a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
                  <Icon name={allAdded ? 'check' : 'shopping-outline'} size={16} color="#fff" />
                  <Text style={s.ctaText}>{allAdded ? 'All added to bag' : `Add all ${items.length} to Bag`}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: V.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: V.cardBorder },
  hIcon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.1)', alignItems: 'center', justifyContent: 'center' },
  hTitle: { color: V.text, fontFamily: SERIF, fontSize: 19, fontWeight: '700' },
  hSub: { color: V.amber, fontSize: 11, marginTop: 2 },
  row: { flexDirection: 'row', gap: 14, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  thumb: { width: 92, height: 118, borderRadius: 12 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cat: { flex: 1, color: V.orange, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  heartBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,90,31,0.12)', alignItems: 'center', justifyContent: 'center' },
  name: { color: V.text, fontFamily: SERIF, fontSize: 16, fontWeight: '700', marginTop: 4 },
  maker: { color: V.dim, fontSize: 10, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 },
  price: { color: V.amber, fontSize: 16, fontWeight: '800' },
  oldPrice: { color: V.dim, fontSize: 11, textDecorationLine: 'line-through' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: V.muted, fontSize: 10 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(245,166,35,0.5)' },
  addBtnOn: { backgroundColor: V.orange, borderColor: V.orange },
  addText: { color: V.amber, fontSize: 10, fontWeight: '800' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: V.cardBorder, backgroundColor: 'rgba(10,6,3,0.6)' },
  cta: { height: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(255,90,31,0.35)' },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { color: V.text, fontFamily: SERIF, fontSize: 22, fontWeight: '700' },
  emptySub: { color: V.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  ghost: { marginTop: 14, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,90,31,0.5)' },
  ghostText: { color: V.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
