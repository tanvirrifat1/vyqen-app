import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { formatPrice, V } from '@/constants/vyqen';
import { useBag } from '@/store/bag';
import { useFavorites } from '@/store/favorites';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

type IconName = React.ComponentProps<typeof Icon>['name'];

export function Eyebrow({ children }: { children: string }) {
  return <Text style={s.eyebrow}>{children}</Text>;
}

export function Heading({ plain, italic }: { plain: string; italic?: string }) {
  return (
    <Text style={s.heading}>
      {plain}
      {italic ? <Text style={s.headingItalic}>{'\n' + italic}</Text> : null}
    </Text>
  );
}

export function Body({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={[s.body, style]}>{children}</Text>;
}

export function PrimaryButton({ label, icon, onPress }: { label: string; icon?: IconName; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <LinearGradient colors={[V.orange, '#ff7a2f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btn}>
        <Text style={s.btnText}>{label}</Text>
        {icon ? <Icon name={icon} size={14} color="#fff" /> : null}
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.ghost, pressed && { opacity: 0.7 }]}>
      <Text style={s.ghostText}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function Placeholder({ tint, icon = 'lamp', style }: { tint: [string, string]; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient colors={tint} style={[s.placeholder, style]}>
      <Icon name={icon} size={56} color="rgba(255,255,255,0.55)" />
    </LinearGradient>
  );
}

export function Badge({ label }: { label: string }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeText}>{label}</Text>
    </View>
  );
}

export function ProductCard({
  p,
  width,
}: {
  p: { id: string; badge: string; name: string; desc: string; price: number; oldPrice?: number; rating: number; reviews: number; tint: [string, string]; category?: string; maker?: string };
  width: number;
}) {
  const { add } = useBag();
  const fav = useFavorites();
  const liked = fav.has(p.id);
  const [added, setAdded] = useState(false);
  const onOrder = () => {
    add({ id: p.id, name: p.name, price: p.price, tint: p.tint });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
      style={[s.card, { width }]}>
      <View>
        <Placeholder tint={p.tint} style={{ height: width * 1.05 }} />
        <View style={s.badgePos}>
          <Badge label={p.badge} />
        </View>
        <Pressable style={s.heart} onPress={() => fav.toggle(p.id)} hitSlop={8}>
          <Icon name={liked ? 'heart' : 'heart-outline'} size={14} color={liked ? V.orange : '#fff'} />
        </Pressable>
      </View>
      <View style={s.cardBody}>
        {p.category ? (
          <View style={s.metaRow}>
            <Text style={s.metaCat}>{p.category}</Text>
            <Text style={s.metaMaker} numberOfLines={1}>{p.maker}</Text>
          </View>
        ) : null}
        <Text style={s.cardName} numberOfLines={1}>{p.name}</Text>
        <Text style={s.cardDesc} numberOfLines={3}>{p.desc}</Text>
        <View style={s.priceRow}>
          <Text style={s.price}>{formatPrice(p.price)}</Text>
          {p.oldPrice ? <Text style={s.oldPrice}>{formatPrice(p.oldPrice)}</Text> : null}
        </View>
        <View style={s.cardFoot}>
          <View style={s.ratingRow}>
            <Icon name="star" size={11} color={V.amber} />
            <Text style={s.rating}>{p.rating.toFixed(1)} ({p.reviews})</Text>
          </View>
          <Pressable onPress={onOrder} style={[s.detailsBtn, added && { borderColor: V.orange }]}>
            <Text style={s.detailsText}>{added ? 'Added ✓' : 'Order'}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  eyebrow: { color: V.orange, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  heading: { color: V.text, fontFamily: SERIF, fontSize: 28, lineHeight: 34, fontWeight: '600' },
  headingItalic: { color: V.amber, fontStyle: 'italic', fontWeight: '500' },
  body: { color: V.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, boxShadow: '0 4px 16px rgba(255,90,31,0.4)' },
  btnText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  ghost: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(255,255,255,0.04)' },
  ghostText: { color: V.text, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(255,255,255,0.03)' },
  chipActive: { backgroundColor: V.orange, borderColor: V.orange },
  chipText: { color: V.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: V.orange, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  badgePos: { position: 'absolute', top: 8, left: 8 },
  heart: { position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: V.card, borderRadius: 14, borderWidth: 1, borderColor: V.cardBorder, overflow: 'hidden' },
  cardBody: { padding: 10, gap: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  metaCat: { color: V.orange, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  metaMaker: { color: V.dim, fontSize: 7, fontWeight: '600', letterSpacing: 0.6, flexShrink: 1 },
  cardName: { color: V.text, fontFamily: SERIF, fontSize: 13, fontWeight: '700' },
  cardDesc: { color: V.muted, fontSize: 9, lineHeight: 13 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
  price: { color: V.amber, fontSize: 14, fontWeight: '800' },
  oldPrice: { color: V.dim, fontSize: 9, textDecorationLine: 'line-through' },
  cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { color: V.muted, fontSize: 9 },
  detailsBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: V.cardBorder },
  detailsText: { color: V.amber, fontSize: 9, fontWeight: '700' },
});
