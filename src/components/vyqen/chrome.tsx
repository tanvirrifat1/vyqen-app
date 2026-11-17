import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { V } from '@/constants/vyqen';
import { useBag } from '@/store/bag';
import { useFavorites } from '@/store/favorites';

export const PAD = 20;

function Logo() {
  return (
    <View style={s.logoRow}>
      <LinearGradient colors={[V.orange, V.amber]} style={s.logoMark}>
        <Icon name="lightbulb-on" size={14} color="#fff" />
      </LinearGradient>
      <Text style={s.logoText}>VYQEN</Text>
    </View>
  );
}

export function AppHeader() {
  const { count } = useBag();
  const favCount = useFavorites().ids.length;
  return (
    <View style={s.header}>
      <Logo />
      <View style={s.headerRight}>
        <Pressable
          onPress={() => router.navigate({ pathname: '/collection', params: { focus: String(Date.now()) } })}
          hitSlop={8}>
          <Icon name="magnify" size={20} color={V.text} />
        </Pressable>
        <Pressable onPress={() => router.push('/favorites')} hitSlop={8}>
          <Icon name={favCount ? 'heart' : 'heart-outline'} size={20} color={favCount ? V.orange : V.text} />
          {favCount ? (
            <View style={s.favBadge}>
              <Text style={s.favBadgeText}>{favCount}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable style={s.bagPill} onPress={() => router.push('/bag')} hitSlop={6}>
          <Icon name="shopping-outline" size={14} color="#fff" />
          <Text style={s.bagText}>Bag {count}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const TRUST = [
  ['diamond-stone', 'Mouth-Blown Crystal'],
  ['weather-sunset', 'Warm Circadian Glow'],
  ['shield-check-outline', '5-Year Guarantee'],
  ['truck-delivery-outline', 'White-Glove Transit'],
] as const;

export function TrustStrip() {
  return (
    <View style={[s.section, s.trust]}>
      {TRUST.map(([ic, label]) => (
        <View key={label} style={s.trustItem}>
          <Icon name={ic} size={16} color={V.orange} />
          <Text style={s.trustText}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

export function Footer() {
  return (
    <View style={[s.section, s.footer]}>
      <Logo />
      <Text style={s.footText}>We create architectural luminaires that infuse spaces with amber warmth, sculptural grace, and contemplative peace. Handcrafted from pure brass, glass and stone.</Text>
      <Text style={s.footText}>Studio & Atelier: 80 Fant Road, Mirpur, Dhaka, Bangladesh</Text>
      <Text style={s.footText}>© 2026 VYQEN Luminaire Atelier. All rights reserved.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  section: { paddingHorizontal: PAD, paddingTop: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD, paddingVertical: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: V.text, fontSize: 14, fontWeight: '800', letterSpacing: 2.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bagPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: V.orange, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  favBadge: { position: 'absolute', top: -6, right: -8, minWidth: 14, height: 14, borderRadius: 7, paddingHorizontal: 3, backgroundColor: V.amber, alignItems: 'center', justifyContent: 'center' },
  favBadgeText: { color: '#1a0b04', fontSize: 8, fontWeight: '900' },
  bagText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  trust: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  trustItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8 },
  trustText: { color: V.muted, fontSize: 11, fontWeight: '600', flexShrink: 1 },
  footer: { gap: 10, borderTopWidth: 1, borderTopColor: V.cardBorder, marginTop: 28, paddingTop: 24 },
  footText: { color: V.dim, fontSize: 10, lineHeight: 15 },
});
