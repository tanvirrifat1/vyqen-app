import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Body,
  Chip,
  Eyebrow,
  GhostButton,
  Heading,
  Placeholder,
  PrimaryButton,
  ProductCard,
} from '@/components/vyqen/parts';
import { AppHeader, Footer, TrustStrip } from '@/components/vyqen/chrome';
import { useBag } from '@/store/bag';
import { BottomTabInset } from '@/constants/theme';
import { FILTERS, formatPrice, LAMP_TYPES, MATERIALS, PRODUCTS, ROOMS, STANDS, V } from '@/constants/vyqen';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const GAP = 12;
const PAD = 20;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const cardW = (width - PAD * 2 - GAP) / 2;

  const { add } = useBag();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL');
  const [lamp, setLamp] = useState(0);
  const [room, setRoom] = useState(0);

  const products = useMemo(
    () => (filter === 'ALL' ? PRODUCTS : PRODUCTS.filter((p) => p.filter === filter)),
    [filter],
  );
  const activeLamp = LAMP_TYPES[lamp];
  const activeRoom = ROOMS[room];

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#3a1a08', V.bg, '#2a1206', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <AppHeader />

        <ScrollView contentContainerStyle={{ paddingBottom: BottomTabInset + 24 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={s.section}>
            <View style={s.heroTag}>
              <Icon name="star-four-points" size={10} color={V.orange} />
              <Text style={s.heroTagText}>2026 ATELIER COLLECTION</Text>
            </View>
            <Text style={s.heroTitle}>
              Sculpting Light,
              <Text style={s.heroItalic}>{'\n'}Defining Atmosphere.</Text>
            </Text>
            <Body>
              Bespoke mouth-blown amber crystal and hand-spun solid brass luminaires. Crafted in limited atelier editions to infuse contemporary spaces with serene warmth.
            </Body>
            <View style={s.row}>
              <PrimaryButton label="EXPLORE LUMINAIRES" icon="arrow-right" onPress={() => router.navigate('/collection')} />
              <GhostButton label="CRAFT STORY" onPress={() => router.navigate('/about')} />
            </View>
            <LinearGradient colors={['#2a1608', '#120a05']} style={s.heroImage}>
              <LinearGradient colors={['rgba(255,140,40,0.55)', 'transparent']} style={s.heroGlow} />
              <Icon name="lamp" size={110} color={V.orange} />
            </LinearGradient>
          </View>

          {/* Seven ways to glow */}
          <View style={s.section}>
            <Eyebrow>CURATED ATELIER TYPOLOGIES</Eyebrow>
            <Heading plain="Seven Ways " italic="to Glow." />
            <Body>Tap a luminaire to inspect it. Pull the cord to test its ambient light, and commission directly to your bag.</Body>
            <View style={s.stage}>
              <View style={[s.stageGlow, { backgroundColor: activeLamp.color }]} />
              <Icon name="floor-lamp" size={120} color={activeLamp.color} />
              <Text style={s.stageName}>{activeLamp.name}</Text>
              <Text style={s.stagePrice}>{formatPrice(activeLamp.price)}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 12 }}>
              {LAMP_TYPES.map((l, i) => (
                <Pressable key={l.name} onPress={() => setLamp(i)} style={[s.pill, i === lamp && s.pillActive]}>
                  <View style={[s.dot, { backgroundColor: l.color }]} />
                  <Text style={[s.pillText, i === lamp && { color: '#fff' }]}>{l.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={{ marginTop: 14, alignSelf: 'flex-start' }}>
              <PrimaryButton label={`ADD ${activeLamp.name.toUpperCase()} TO BAG`} onPress={() => add({ id: `lamp-${activeLamp.name.toLowerCase()}`, name: `${activeLamp.name} Luminaire`, price: activeLamp.price, tint: [activeLamp.color, '#1a0f08'] })} />
            </View>
          </View>

          {/* Featured */}
          <View style={s.section}>
            <Eyebrow>ATELIER HIGHLIGHTS</Eyebrow>
            <Heading plain="Featured Lighting Masterpieces" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 14 }}>
              {FILTERS.map((f) => (
                <Chip key={f} label={f} active={f === filter} onPress={() => setFilter(f)} />
              ))}
            </ScrollView>
            <View style={s.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} p={p} width={cardW} />
              ))}
            </View>
          </View>

          {/* 3D printed */}
          <View style={s.section}>
            <View style={s.heroTag}>
              <Icon name="printer-3d" size={11} color={V.orange} />
              <Text style={s.heroTagText}>ATELIER 3D PRINT LAB · BATTLESTATION SERIES</Text>
            </View>
            <Heading plain="Precision 3D Printed" italic="Console & Controller Docks" />
            <Body>Elevate your console setup into a piece of sculpted desk architecture. Each stand is 3D printed with ultra-fine 0.16mm layers.</Body>
            <View style={[s.grid, { marginTop: 14 }]}>
              {STANDS.map((p) => (
                <ProductCard key={p.id} p={p} width={cardW} />
              ))}
            </View>
            <View style={s.commission}>
              <Icon name="cube-outline" size={20} color={V.orange} />
              <View style={{ flex: 1 }}>
                <Text style={s.commissionTitle}>Need a Custom Gamertag Engraved or Bespoke Colorway?</Text>
                <Text style={s.commissionSub}>Our 3D print lab embosses custom gamertags, team logos, and dual-tone colors upon request.</Text>
              </View>
            </View>
            <View style={{ marginTop: 12, alignSelf: 'flex-start' }}>
              <PrimaryButton label="COMMISSION CUSTOM STAND" icon="arrow-right" onPress={() => router.navigate('/contact')} />
            </View>
          </View>

          {/* Atmospheric living */}
          <View style={s.section}>
            <Eyebrow>ATMOSPHERIC LIVING</Eyebrow>
            <Heading plain="Your Space, Your Story" />
            <Body>Every room carries an emotion. Explore how warm amber luminescence shapes your sanctuary and tells your personal design story.</Body>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 14 }}>
              {ROOMS.map((r, i) => (
                <Chip key={r.key} label={r.key} active={i === room} onPress={() => setRoom(i)} />
              ))}
            </ScrollView>
            <View style={s.roomCard}>
              <Placeholder tint={activeRoom.tint} icon="sofa-outline" style={{ height: 180, borderRadius: 12 }} />
              <Text style={[s.eyebrowSmall, { marginTop: 14 }]}>ATMOSPHERE BLUEPRINT</Text>
              <Text style={s.roomTitle}>{activeRoom.title}</Text>
              <Text style={s.cardDescLg}>{activeRoom.desc}</Text>
              <View style={s.recBox}>
                <Text style={s.recLabel}>Recommended Configuration</Text>
                <Text style={s.recValue}>{activeRoom.rec}</Text>
              </View>
              <Pressable onPress={() => router.navigate('/contact')}>
                <Text style={s.link}>REQUEST ARCHITECTURAL LIGHTING LAYOUT →</Text>
              </Pressable>
            </View>
          </View>

          {/* Materials */}
          <View style={s.section}>
            <Eyebrow>ARTISANAL INTEGRITY</Eyebrow>
            <Heading plain="Materials That Age" italic="With Dignity & Grace." />
            <Body>We reject fleeting plastic fixtures. Every Vyqen luminaire is created from raw elements that respond to touch, develop rich patinas, and diffuse a healthy circadian spectrum.</Body>
            <View style={{ gap: 14, marginTop: 16 }}>
              {MATERIALS.map((m) => (
                <View key={m.title} style={s.matRow}>
                  <View style={s.matIcon}>
                    <Icon name={m.icon} size={16} color={V.orange} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.matTitle}>{m.title}</Text>
                    <Text style={s.matDesc}>{m.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ marginTop: 14, alignSelf: 'flex-start' }}>
              <GhostButton label="READ FULL ATELIER DOSSIER →" onPress={() => router.navigate('/about')} />
            </View>
          </View>

          {/* CTA */}
          <View style={s.section}>
            <LinearGradient colors={['#4a1d08', '#1a0d06']} style={s.cta}>
              <Text style={s.ctaEyebrow}>PRIVATE COMMISSION PROGRAM</Text>
              <Text style={s.ctaTitle}>Designing a Luxury Residence or Boutique Hotel?</Text>
              <Text style={s.cardDescLg}>Connect with our master lighting architect for custom dimensioning, bespoke patinas, and trade-tier pricing for complete architectural installations.</Text>
              <View style={[s.row, { marginTop: 16 }]}>
                <PrimaryButton label="BOOK DESIGN CONSULTATION" onPress={() => router.navigate('/contact')} />
              </View>
              <View style={[s.row, { marginTop: 8 }]}>
                <GhostButton label="BROWSE ALL 2026 PIECES" onPress={() => router.navigate('/collection')} />
              </View>
            </LinearGradient>
          </View>

          <TrustStrip />
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: V.bg },
  section: { paddingHorizontal: PAD, paddingTop: 36 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.08)', marginBottom: 14 },
  heroTagText: { color: V.orange, fontSize: 8, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: { color: V.text, fontFamily: SERIF, fontSize: 36, lineHeight: 42, fontWeight: '600' },
  heroItalic: { color: V.amber, fontStyle: 'italic', fontWeight: '500' },
  heroImage: { height: 260, borderRadius: 20, marginTop: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: V.cardBorder },
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 140 },
  stage: { height: 280, marginTop: 18, borderRadius: 20, backgroundColor: '#080503', borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  stageGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, opacity: 0.18, top: 30 },
  stageName: { color: V.text, fontFamily: SERIF, fontSize: 18, fontWeight: '700', marginTop: 6 },
  stagePrice: { color: V.amber, fontSize: 13, fontWeight: '700', marginTop: 2 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(255,255,255,0.04)' },
  pillActive: { backgroundColor: 'rgba(255,90,31,0.25)', borderColor: V.orange },
  pillText: { color: V.muted, fontSize: 11, fontWeight: '700' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  commission: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 16, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  commissionTitle: { color: V.text, fontSize: 12, fontWeight: '700' },
  commissionSub: { color: V.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  roomCard: { padding: 12, borderRadius: 18, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  eyebrowSmall: { color: V.orange, fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  roomTitle: { color: V.text, fontFamily: SERIF, fontSize: 22, fontWeight: '700', marginTop: 4 },
  cardDescLg: { color: V.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  recBox: { marginTop: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(0,0,0,0.3)' },
  recLabel: { color: V.dim, fontSize: 9 },
  recValue: { color: V.amber, fontSize: 11, fontWeight: '700', marginTop: 3 },
  link: { color: V.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 14 },
  matRow: { flexDirection: 'row', gap: 12 },
  matIcon: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', alignItems: 'center', justifyContent: 'center' },
  matTitle: { color: V.text, fontSize: 13, fontWeight: '700' },
  matDesc: { color: V.muted, fontSize: 11, lineHeight: 16, marginTop: 2 },
  cta: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,90,31,0.3)' },
  ctaEyebrow: { color: V.orange, fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  ctaTitle: { color: V.text, fontFamily: SERIF, fontSize: 24, lineHeight: 30, fontWeight: '700', marginTop: 8 },
});
