import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Footer, PAD, TrustStrip } from '@/components/vyqen/chrome';
import { Eyebrow, GhostButton, Placeholder, PrimaryButton } from '@/components/vyqen/parts';
import { BottomTabInset } from '@/constants/theme';
import { V } from '@/constants/vyqen';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

type IconName = React.ComponentProps<typeof Icon>['name'];

const LIGHTING = [
  'Table Lamps: Solis, Ember & Arc reading luminaires with capacitive brass touch-dimming.',
  'Pendant Chandeliers: Aurora & Halo mouth-blown optic glass suspensions for dining & salons.',
  'Sculptural Floor Arcs: Minimalist cantilevered floor columns for reading corners.',
  'Cordless Ambient Art: Portable low-fired terracotta lanterns for bedside and terraces.',
];

const STANDS_LIST = [
  'PlayStation Iconic Stands: Sculpted □ △ ✕ ○ geometric docks engineered for PS5 DualSense & PS4 controllers.',
  'Dual Controller & Headset Towers: 2-in-1 multi-tier towers organizing 2 gamepads and an over-ear headset simultaneously.',
  'Universal Minimalist Arcs: Floating low-center-of-gravity cradles fitting PS5, Xbox Series X/S, and Switch Pro.',
  'Cable Routing Guides: Integrated rear wire passages for discrete, tangle-free controller charging.',
];

const STANDARDS: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'layers-outline', title: '0.16mm Layer Precision', desc: 'High-resolution micro-layers eliminate harsh 3D print stepping, delivering a tactile satin-matte finish.' },
  { icon: 'gamepad-variant-outline', title: 'Zero Stick Compression', desc: 'Recessed analog cradle contours eliminate pressure on thumbsticks and triggers, preventing joystick drift.' },
  { icon: 'shield-check-outline', title: 'Weighted Anti-Slip Base', desc: 'Internal core ballast combined with silicone micro-pads ensures stable, one-handed controller docking.' },
  { icon: 'headphones', title: 'Cushion Safe Headset Arcs', desc: 'Wide-radius curved headrests distribute weight evenly across headbands without denting memory foam cushions.' },
];

const FINISHES = [
  { name: 'Matte Obsidian', color: '#1a1a1a', ring: '#555555' },
  { name: 'Atelier Terracotta', color: '#e8622a', ring: '#e8622a' },
  { name: 'Alpine White', color: '#ffffff', ring: '#ffffff' },
];

function Discipline({
  icon,
  dept,
  title,
  desc,
  items,
  cta,
  onPress,
}: {
  icon: IconName;
  dept: string;
  title: string;
  desc: string;
  items: string[];
  cta: string;
  onPress: () => void;
}) {
  return (
    <View style={s.disc}>
      <View style={s.discIcon}>
        <Icon name={icon} size={18} color={V.orange} />
      </View>
      <Text style={s.dept}>{dept}</Text>
      <Text style={s.discTitle}>{title}</Text>
      <Text style={s.discDesc}>{desc}</Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {items.map((i) => (
          <View key={i} style={s.li}>
            <View style={s.liDot}>
              <Icon name="check" size={9} color={V.orange} />
            </View>
            <Text style={s.liText}>{i}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={onPress} style={s.discFoot}>
        <Text style={s.link}>{cta} →</Text>
      </Pressable>
    </View>
  );
}

export default function AboutScreen() {
  const [finish, setFinish] = useState(1);
  const goCollection = () => router.navigate('/collection');

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#3a1a08', V.bg, '#2a1206', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <AppHeader />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: BottomTabInset + 24 }}>
          {/* Hero */}
          <View style={s.pad}>
            <LinearGradient colors={['#1d120a', '#0f0805']} style={s.hero}>
              <Eyebrow>THE VYQEN ATELIER DOSSIER</Eyebrow>
              <Text style={s.heroTitle}>
                Artisanal Lighting &{'\n'}
                <Text style={s.italic}>Precision 3D Printed Desk Architecture.</Text>
              </Text>
              <Text style={s.heroSub}>
                Vyqen brings serene amber warmth to living interiors and sculptural, weighted order to modern battlestations. We craft handcrafted circadian luminaires alongside custom 3D printed console docks, controller cradles, and headset towers.
              </Text>
              <View style={s.heroBtns}>
                <PrimaryButton label="BROWSE ALL CREATIONS" onPress={goCollection} />
                <GhostButton label="3D PRINTED STANDS" onPress={goCollection} />
              </View>
            </LinearGradient>
          </View>

          {/* Two disciplines */}
          <View style={[s.pad, s.center, { marginTop: 40 }]}>
            <Eyebrow>WHAT WE CREATE</Eyebrow>
            <Text style={s.h2}>Two Craft Disciplines Under One Roof</Text>
            <Text style={s.sub}>
              From atmospheric bedtime sanctuaries to ultra-clean gaming workstations, our products are built with intentional geometry, tactile materials, and everyday durability.
            </Text>
          </View>
          <View style={[s.pad, { gap: 14, marginTop: 20 }]}>
            <Discipline
              icon="lamp"
              dept="DEPARTMENT I"
              title="Architectural Lighting Luminaires"
              desc="Handcrafted lighting sculptures tuned specifically between 2200K (Candlelight) and 2700K (Sunset warmth) to calm the evening nervous system and cast organic shadows."
              items={LIGHTING}
              cta="VIEW LIGHTING COLLECTION"
              onPress={goCollection}
            />
            <Discipline
              icon="controller"
              dept="DEPARTMENT II"
              title="3D Printed Console & Controller Stands"
              desc="Sculptural desk organization engineered in high-density bio-polymers. Custom-contoured for modern gamepads and audiophile headsets with weighted anti-slip bases."
              items={STANDS_LIST}
              cta="VIEW 3D PRINTED STAND LINEUP"
              onPress={goCollection}
            />
          </View>

          {/* Engineering */}
          <View style={[s.pad, s.center, { marginTop: 44 }]}>
            <Eyebrow>ATELIER 3D PRINT STANDARDS</Eyebrow>
            <Text style={s.h2}>How We Engineer Every 3D Stand</Text>
            <Text style={s.sub}>
              We don’t produce flimsy plastic trinkets. Every console dock and headphone tower is engineered with industrial tolerances, tailored curves, and anti-slip balance.
            </Text>
          </View>
          <View style={[s.pad, s.stdGrid]}>
            {STANDARDS.map((x) => (
              <View key={x.title} style={s.std}>
                <View style={s.discIcon}>
                  <Icon name={x.icon} size={16} color={V.orange} />
                </View>
                <Text style={s.stdTitle}>{x.title}</Text>
                <Text style={s.stdDesc}>{x.desc}</Text>
                <View style={s.stdFoot}>
                  <Icon name="check" size={11} color={V.orange} />
                  <Text style={s.stdFootText}>High-Density PLA+ Standard</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[s.pad, { marginTop: 14 }]}>
            <View style={s.finishes}>
              <Text style={s.finTitle}>Available In Three Curated 3D Print Finishes</Text>
              <Text style={s.finSub}>
                Choose between <Text style={s.bold}>Matte Obsidian Black</Text>, <Text style={s.bold}>Atelier Terracotta Orange</Text>, and <Text style={s.bold}>Alpine White</Text> on any stand model.
              </Text>
              <View style={s.finRow}>
                {FINISHES.map((f, i) => (
                  <Pressable key={f.name} onPress={() => setFinish(i)} style={[s.finPill, i === finish && s.finOn]}>
                    <View style={[s.finDot, { backgroundColor: f.color, borderColor: f.ring }]} />
                    <Text style={[s.finText, i === finish && { color: V.text }]}>{f.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Philosophy */}
          <View style={[s.pad, { marginTop: 44 }]}>
            <Placeholder tint={['#0f5a5f', '#1d8c93']} icon="ceiling-light" style={s.philImg} />
            <View style={s.note}>
              <Text style={s.noteTitle}>Atelier Craft Note</Text>
              <Text style={s.noteText}>Optic crystal and solid brushed brass billets shaped to diffuse warm golden luminescence across Bangladeshi residences.</Text>
            </View>
            <View style={{ marginTop: 22 }}>
              <Eyebrow>THE LIGHTING PHILOSOPHY</Eyebrow>
              <Text style={s.h2Left}>Why We Chose Warm Sunset Amber & Terracotta</Text>
              <Text style={s.body}>
                Cold white 5000K fluorescent lighting creates subconscious visual fatigue. Our lamps are calibrated between 2200K (Candlelight) and 2700K (Sunset warmth) to transition your mind into peaceful restoration.
              </Text>
              <Text style={s.body}>
                Each piece honors high 95+ CRI natural color rendering, ensuring wood grains, fabrics, and interior textures look rich and uncompromised.
              </Text>
              <View style={s.stats}>
                <View style={s.stat}>
                  <Text style={s.statNum}>2200K</Text>
                  <Text style={s.statDesc}>Candlelight warmth for deep bedtime relaxation</Text>
                </View>
                <View style={s.stat}>
                  <Text style={s.statNum}>95+ CRI</Text>
                  <Text style={s.statDesc}>Color rendering index that honors natural wood & marble</Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTA */}
          <View style={[s.pad, { marginTop: 44 }]}>
            <LinearGradient colors={['#4a1d08', '#1a0d06']} style={s.cta}>
              <Eyebrow>CUSTOM ORDERS & 3D COMMISSIONS</Eyebrow>
              <Text style={s.h2}>Have a Specific Space or Custom 3D Idea?</Text>
              <Text style={[s.sub, { marginTop: 10 }]}>
                We emboss custom gamer handles on console docks and tailor architectural lighting arrays. Delivery available across Dhaka (60 ৳) and all districts outside Dhaka (120 ৳).
              </Text>
              <View style={s.heroBtns}>
                <PrimaryButton label="EXPLORE COLLECTION" onPress={goCollection} />
                <GhostButton label="REQUEST CUSTOM COMMISSION →" onPress={() => router.navigate('/contact')} />
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
  pad: { paddingHorizontal: PAD },
  center: { alignItems: 'center' },
  hero: { padding: 22, borderRadius: 20, borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center' },
  heroTitle: { color: V.text, fontFamily: SERIF, fontSize: 30, lineHeight: 38, fontWeight: '600', textAlign: 'center' },
  italic: { color: V.amber, fontStyle: 'italic', fontWeight: '500' },
  heroSub: { color: V.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 14 },
  heroBtns: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20 },
  h2: { color: V.text, fontFamily: SERIF, fontSize: 24, lineHeight: 30, fontWeight: '600', textAlign: 'center' },
  h2Left: { color: V.text, fontFamily: SERIF, fontSize: 26, lineHeight: 33, fontWeight: '600' },
  sub: { color: V.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 },
  body: { color: V.muted, fontSize: 13, lineHeight: 20, marginTop: 12 },
  disc: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(10,6,3,0.75)' },
  discIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.1)', alignItems: 'center', justifyContent: 'center' },
  dept: { color: V.orange, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginTop: 14 },
  discTitle: { color: V.text, fontFamily: SERIF, fontSize: 22, lineHeight: 28, fontWeight: '600', marginTop: 6 },
  discDesc: { color: V.muted, fontSize: 12, lineHeight: 18, marginTop: 10 },
  li: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  liDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,90,31,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  liText: { flex: 1, color: V.muted, fontSize: 11, lineHeight: 17 },
  discFoot: { marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: V.cardBorder },
  link: { color: V.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  stdGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
  std: { width: '48%', flexGrow: 1, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  stdTitle: { color: V.text, fontFamily: SERIF, fontSize: 15, fontWeight: '700', marginTop: 12 },
  stdDesc: { color: V.muted, fontSize: 10, lineHeight: 15, marginTop: 6 },
  stdFoot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: V.cardBorder },
  stdFootText: { color: V.orange, fontSize: 9, fontWeight: '700', flexShrink: 1 },
  finishes: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  finTitle: { color: V.text, fontFamily: SERIF, fontSize: 16, fontWeight: '700' },
  finSub: { color: V.muted, fontSize: 11, lineHeight: 17, marginTop: 6 },
  bold: { color: V.text, fontWeight: '800' },
  finRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  finPill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(255,255,255,0.03)' },
  finOn: { borderColor: V.orange, backgroundColor: 'rgba(255,90,31,0.14)' },
  finDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 },
  finText: { color: V.muted, fontSize: 11, fontWeight: '600' },
  philImg: { height: 340, borderRadius: 20 },
  note: { marginTop: -70, marginHorizontal: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(10,6,3,0.92)' },
  noteTitle: { color: V.orange, fontSize: 10, fontWeight: '800' },
  noteText: { color: V.text, fontSize: 11, lineHeight: 16, marginTop: 3 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 18 },
  stat: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  statNum: { color: V.amber, fontFamily: SERIF, fontSize: 20, fontWeight: '700' },
  statDesc: { color: V.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  cta: { padding: 22, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,90,31,0.3)', alignItems: 'center' },
});
