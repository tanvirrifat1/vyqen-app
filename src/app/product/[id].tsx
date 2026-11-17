import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Placeholder } from '@/components/vyqen/parts';
import { formatPrice, getProduct, V } from '@/constants/vyqen';
import { useBag } from '@/store/bag';
import { useFavorites } from '@/store/favorites';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const TEMPS = ['2200K Candlelight', '2700K Warm Sunset'] as const;

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const { add } = useBag();

  const [img, setImg] = useState(0);
  const [temp, setTemp] = useState(1);
  const [qty, setQty] = useState(1);
  const fav = useFavorites();
  const liked = fav.has(product?.id ?? '');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <View style={[s.root, s.center]}>
        <Text style={s.title}>Product not found</Text>
        <Pressable onPress={() => goBack()} style={s.backLink}>
          <Text style={s.linkText}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  const onAdd = () => {
    add({ id: product.id, name: product.name, price: product.price, tint: product.gallery[0], temp: TEMPS[temp] }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {/* Gallery */}
          <View>
            <Placeholder tint={product.gallery[img]} style={s.hero} />
            <View style={s.badgePos}>
              <Badge label={product.badge} />
            </View>
            <Pressable style={s.close} onPress={() => goBack()} hitSlop={8}>
              <Icon name="close" size={18} color="#fff" />
            </Pressable>
          </View>
          <View style={s.thumbs}>
            {product.gallery.map((g, i) => (
              <Pressable key={i} onPress={() => setImg(i)} style={[s.thumb, i === img && s.thumbActive]}>
                <Placeholder tint={g} style={StyleSheet.absoluteFill} />
              </Pressable>
            ))}
          </View>

          {/* Info */}
          <View style={s.metaRow}>
            <Text style={s.cat}>{product.category}</Text>
            <Text style={s.maker}>BY {product.maker}</Text>
          </View>
          <Text style={s.title}>{product.name}</Text>
          <View style={s.ratingRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Icon key={i} name="star" size={14} color={V.amber} />
            ))}
            <Text style={s.ratingNum}>{product.rating.toFixed(1)}</Text>
            <Text style={s.ratingSub}>({product.reviews} atelier reviews)</Text>
          </View>

          <View style={s.priceRow}>
            <Text style={s.price}>{formatPrice(product.price)}</Text>
            {product.oldPrice ? <Text style={s.oldPrice}>{formatPrice(product.oldPrice)}</Text> : null}
            <Text style={s.stock}>In Stock (Ready to dispatch)</Text>
          </View>
          <View style={s.divider} />

          <Text style={s.long}>{product.long}</Text>

          {/* Temperature */}
          <View style={s.tempLabel}>
            <Icon name="white-balance-sunny" size={14} color={V.orange} />
            <Text style={s.tempLabelText}>Atmosphere Temperature:</Text>
          </View>
          <View style={s.tempRow}>
            {TEMPS.map((t, i) => (
              <Pressable key={t} onPress={() => setTemp(i)} style={[s.tempBtn, i === temp && s.tempActive]}>
                <Text style={[s.tempText, i === temp && { color: V.amber }]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          {/* Specs */}
          <View style={s.specs}>
            <View style={s.specRow}>
              <Text style={s.spec}><Text style={s.specKey}>Output: </Text>{product.specs.output}</Text>
              <Text style={s.spec}><Text style={s.specKey}>Power: </Text>{product.specs.power}</Text>
            </View>
            <Text style={[s.spec, { marginTop: 8 }]}><Text style={s.specKey}>Craft: </Text>{product.specs.craft}</Text>
          </View>

          {/* Actions */}
          <View style={s.actions}>
            <View style={s.qty}>
              <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} hitSlop={8}>
                <Icon name="minus" size={16} color={V.muted} />
              </Pressable>
              <Text style={s.qtyNum}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => q + 1)} hitSlop={8}>
                <Icon name="plus" size={16} color={V.muted} />
              </Pressable>
            </View>
            <Pressable onPress={onAdd} style={{ flex: 1 }}>
              <LinearGradient colors={[V.orange, '#ff7a2f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.addBtn}>
                <Icon name={added ? 'check' : 'shopping-outline'} size={16} color="#fff" />
                <Text style={s.addText} numberOfLines={1}>
                  {added ? 'Added to Bag' : `Add to Bag • ${formatPrice(product.price * qty)}`}
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => fav.toggle(product.id)} style={s.heart}>
              <Icon name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? V.orange : V.muted} />
            </Pressable>
          </View>

          <View style={s.footRow}>
            <Pressable onPress={() => router.navigate('/about')}>
              <Text style={s.linkText}>View full specifications & lookbook →</Text>
            </Pressable>
          </View>
          <View style={s.trustRow}>
            <View style={s.trust}>
              <Icon name="shield-check-outline" size={14} color={V.orange} />
              <Text style={s.trustText}>5y Warranty</Text>
            </View>
            <View style={s.trust}>
              <Icon name="truck-delivery-outline" size={14} color={V.orange} />
              <Text style={s.trustText}>Insured</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: V.bg },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  scroll: { padding: 16, paddingBottom: 32 },
  hero: { height: 320, borderRadius: 20 },
  badgePos: { position: 'absolute', top: 14, left: 14 },
  close: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  thumbs: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 18 },
  thumb: { width: 56, height: 56, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', opacity: 0.7 },
  thumbActive: { borderColor: V.orange, opacity: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cat: { color: V.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  maker: { color: V.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1, flexShrink: 1 },
  title: { color: V.text, fontFamily: SERIF, fontSize: 26, fontWeight: '700', marginTop: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 8 },
  ratingNum: { color: V.text, fontSize: 12, fontWeight: '800', marginLeft: 6 },
  ratingSub: { color: V.muted, fontSize: 11 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  price: { color: V.amber, fontSize: 30, fontWeight: '800' },
  oldPrice: { color: V.dim, fontSize: 13, textDecorationLine: 'line-through' },
  stock: { color: '#2fd08a', fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: V.cardBorder, marginVertical: 14 },
  long: { color: V.text, fontSize: 13, lineHeight: 21, opacity: 0.9 },
  tempLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20 },
  tempLabelText: { color: V.text, fontSize: 12, fontWeight: '700' },
  tempRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  tempBtn: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 10, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  tempActive: { borderColor: V.orange, backgroundColor: 'rgba(255,90,31,0.14)' },
  tempText: { color: V.muted, fontSize: 11, fontWeight: '600' },
  specs: { marginTop: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  spec: { color: V.muted, fontSize: 11, lineHeight: 16, flex: 1 },
  specKey: { color: V.text, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22 },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, height: 50, borderRadius: 12, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  qtyNum: { color: V.text, fontSize: 14, fontWeight: '800', minWidth: 14, textAlign: 'center' },
  addBtn: { height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 10, boxShadow: '0 4px 18px rgba(255,90,31,0.4)' },
  addText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  heart: { width: 50, height: 50, borderRadius: 12, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card, alignItems: 'center', justifyContent: 'center' },
  footRow: { marginTop: 16 },
  linkText: { color: V.orange, fontSize: 12, fontWeight: '700' },
  backLink: { padding: 8 },
  trustRow: { flexDirection: 'row', gap: 18, marginTop: 12 },
  trust: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustText: { color: V.muted, fontSize: 11 },
});
