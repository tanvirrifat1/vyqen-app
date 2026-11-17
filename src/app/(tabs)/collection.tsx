import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Footer, PAD, TrustStrip } from '@/components/vyqen/chrome';
import { Eyebrow, PrimaryButton, ProductCard } from '@/components/vyqen/parts';
import { BottomTabInset } from '@/constants/theme';
import { PRODUCTS, STANDS, V } from '@/constants/vyqen';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const GAP = 12;

const DEPTS = [
  { key: 'all', label: 'ALL COLLECTIONS', icon: 'shimmer' },
  { key: 'light', label: 'ARCHITECTURAL LIGHTING', icon: 'lamp' },
  { key: '3d', label: '3D PRINTED CONSOLE STANDS', icon: 'printer-3d' },
] as const;

const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated'] as const;

const DIMS: Record<string, string> = {
  s1: 'W 11CM × D 9CM × H 10CM',
  s2: 'W 14CM × D 16CM × H 28CM',
  s3: 'W 9CM × D 11CM × H 8CM',
  s4: 'W 15CM × D 14CM × H 25CM',
};

type Item = { id: string; name: string; desc: string; price: number; rating: number; category?: string; maker?: string };

const DOCKS = STANDS.map((x) => ({ ...x, category: 'VYQEN 3D LAB', maker: DIMS[x.id] }));

function refine<T extends Item>(list: T[], query: string, sort: (typeof SORTS)[number]) {
  const q = query.trim().toLowerCase();
  const out = q
    ? list.filter((x) => [x.name, x.desc, x.category, x.maker].some((f) => f?.toLowerCase().includes(q)))
    : [...list];
  if (sort === 'Price: Low to High') out.sort((a, b) => a.price - b.price);
  else if (sort === 'Price: High to Low') out.sort((a, b) => b.price - a.price);
  else if (sort === 'Top Rated') out.sort((a, b) => b.rating - a.rating);
  return out;
}

export default function CollectionScreen() {
  const { width } = useWindowDimensions();
  const cardW = (width - PAD * 2 - GAP) / 2;
  // lab panel has 16px padding + 1px border on each side
  const dockW = (width - PAD * 2 - 34 - GAP) / 2;

  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const toolbarY = useRef(0);

  const [dept, setDept] = useState<(typeof DEPTS)[number]['key']>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Featured');
  const [sortOpen, setSortOpen] = useState(false);

  // header search icon navigates here with a fresh `focus` value
  useEffect(() => {
    if (!focus) return;
    // wait for the tab transition to finish, otherwise focus() is ignored
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(toolbarY.current - 12, 0), animated: true });
      inputRef.current?.focus();
    }, 350);
    return () => clearTimeout(id);
  }, [focus]);

  const lights = useMemo(() => refine(PRODUCTS, query, sort), [query, sort]);
  const docks = useMemo(() => refine(DOCKS, query, sort), [query, sort]);

  const showLight = dept !== '3d';
  const show3d = dept !== 'light';
  const nothing = (showLight ? lights.length : 0) + (show3d ? docks.length : 0) === 0;

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#3a1a08', V.bg, '#2a1206', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <AppHeader />
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: BottomTabInset + 24 }}>
          {/* Hero */}
          <View style={s.pad}>
            <LinearGradient colors={['#1d120a', '#0f0805']} style={s.hero}>
              <View style={s.tag}>
                <Icon name="star-four-points" size={10} color={V.orange} />
                <Text style={s.tagText}>VYQEN ATELIER DOSSIER • 2026 COLLECTION</Text>
              </View>
              <Text style={s.heroTitle}>The Curated Atelier Collection</Text>
              <Text style={s.heroSub}>
                Discover our dual collections: Handcrafted architectural lighting for peaceful sanctuaries, and precision 3D printed console stands for curated desk spaces.
              </Text>
              <View style={s.deptCol}>
                {DEPTS.map((d) => {
                  const on = d.key === dept;
                  return (
                    <Pressable key={d.key} onPress={() => setDept(d.key)} style={[s.dept, on && s.deptOn]}>
                      <Icon name={d.icon} size={13} color={on ? '#fff' : V.muted} />
                      <Text style={[s.deptText, on && { color: '#fff' }]}>{d.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </LinearGradient>
          </View>

          {/* Search + sort */}
          <View style={[s.pad, { marginTop: 18 }]} onLayout={(e) => (toolbarY.current = e.nativeEvent.layout.y)}>
            <View style={s.toolbar}>
              <View style={s.search}>
                <Icon name="magnify" size={16} color={V.orange} />
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search catalog by name, designer, material…"
                  placeholderTextColor={V.dim}
                  style={s.input}
                  returnKeyType="search"
                />
                {query ? (
                  <Pressable onPress={() => setQuery('')} hitSlop={8}>
                    <Icon name="close-circle" size={16} color={V.dim} />
                  </Pressable>
                ) : null}
              </View>
              <View style={s.toolRow}>
                <View style={s.chips}>
                  <View style={s.specChip}><Text style={[s.specChipText, { color: V.orange }]}>0.16mm Layer Precision</Text></View>
                  <View style={[s.specChip, { borderColor: V.cardBorder }]}><Text style={s.specChipText}>PLA+ Bio-Polymer</Text></View>
                </View>
                <Pressable onPress={() => setSortOpen((o) => !o)} style={s.sortBtn}>
                  <Icon name="tune-variant" size={13} color={V.orange} />
                  <Text style={s.sortText} numberOfLines={1}>Sort: {sort}</Text>
                  <Icon name={sortOpen ? 'chevron-up' : 'chevron-down'} size={14} color={V.muted} />
                </Pressable>
              </View>
              {sortOpen ? (
                <View style={s.sortMenu}>
                  {SORTS.map((o) => (
                    <Pressable
                      key={o}
                      onPress={() => {
                        setSort(o);
                        setSortOpen(false);
                      }}
                      style={s.sortItem}>
                      <Text style={[s.sortItemText, o === sort && { color: V.amber, fontWeight: '800' }]}>{o}</Text>
                      {o === sort ? <Icon name="check" size={14} color={V.amber} /> : null}
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          {nothing ? (
            <View style={[s.pad, s.empty]}>
              <Icon name="lamp-outline" size={36} color={V.dim} />
              <Text style={s.emptyTitle}>No pieces match “{query}”</Text>
              <Text style={s.emptySub}>Try a different name, designer or material.</Text>
            </View>
          ) : null}

          {/* Department I */}
          {showLight && lights.length > 0 ? (
            <View style={[s.pad, { marginTop: 32 }]}>
              <Eyebrow>DEPARTMENT I • LUMINESCENCE</Eyebrow>
              <Text style={s.h2}>Architectural Lighting Collection</Text>
              <View style={s.rule} />
              {dept === 'all' ? (
                <Pressable onPress={() => setDept('light')} style={s.linkRow}>
                  <Text style={s.link}>FILTER LIGHTING ONLY →</Text>
                </Pressable>
              ) : null}
              <View style={s.grid}>
                {lights.map((p) => (
                  <ProductCard key={p.id} p={p} width={cardW} />
                ))}
              </View>
            </View>
          ) : null}

          {/* Department II */}
          {show3d && docks.length > 0 ? (
            <View style={[s.pad, { marginTop: 32 }]}>
              <View style={s.lab}>
                <View style={s.tag}>
                  <Icon name="printer-3d" size={11} color={V.orange} />
                  <Text style={s.tagText}>DEPARTMENT II • ATELIER 3D PRINT LAB</Text>
                </View>
                <Text style={s.h2}>Precision 3D Printed Console & Controller Docks</Text>
                <Text style={s.sub}>
                  Distinctly crafted desk accessories for modern battlestations. Contoured specifically for PlayStation 5 DualSense, Xbox Wireless, and audiophile headsets with weighted anti-slip felt footings.
                </Text>
                {dept === 'all' ? (
                  <Pressable onPress={() => setDept('3d')} style={s.outlineBtn}>
                    <Text style={s.outlineBtnText}>EXPLORE FULL 3D LAB →</Text>
                  </Pressable>
                ) : null}
                <View style={[s.grid, { marginTop: 18 }]}>
                  {docks.map((p) => (
                    <ProductCard key={p.id} p={p} width={dockW} />
                  ))}
                </View>
                <View style={s.checks}>
                  {['0.16mm Layer Precision', 'PS5 DualSense & Headset Tailored', 'Weighted Anti-Slip Base'].map((c) => (
                    <View key={c} style={s.check}>
                      <Icon name="check" size={12} color={V.orange} />
                      <Text style={s.checkText}>{c}</Text>
                    </View>
                  ))}
                </View>
                <Pressable onPress={() => router.navigate('/contact')}>
                  <Text style={[s.link, { marginTop: 12 }]}>Request Custom Color or Gamertag Engraving →</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Commission CTA */}
          <View style={[s.pad, { marginTop: 32 }]}>
            <View style={s.cta}>
              <Text style={s.ctaEyebrow}>BESPOKE ATELIER COMMISSIONS</Text>
              <Text style={s.ctaTitle}>Need Custom Dimensions, Drops, or Custom 3D Desk Accessories?</Text>
              <Text style={s.sub}>Our atelier crafts custom architectural lighting arrays as well as customized 3D printed desk accessories with bespoke gamertag embossing.</Text>
              <View style={{ marginTop: 16, alignSelf: 'flex-start' }}>
                <PrimaryButton label="SEND COMMISSION INQUIRY" icon="arrow-right" onPress={() => router.navigate('/contact')} />
              </View>
            </View>
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
  hero: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.08)', marginBottom: 14 },
  tagText: { color: V.orange, fontSize: 8, fontWeight: '800', letterSpacing: 1.2, flexShrink: 1 },
  heroTitle: { color: V.text, fontFamily: SERIF, fontSize: 30, lineHeight: 36, fontWeight: '600', textAlign: 'center', alignSelf: 'stretch' },
  heroSub: { color: V.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 },
  deptCol: { alignSelf: 'stretch', gap: 8, marginTop: 18 },
  dept: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(255,255,255,0.04)' },
  deptOn: { backgroundColor: V.orange, borderColor: V.orange },
  deptText: { color: V.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  toolbar: { padding: 12, borderRadius: 16, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card, gap: 10 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 42, borderRadius: 10, backgroundColor: '#0d0805', borderWidth: 1, borderColor: V.cardBorder },
  input: { flex: 1, color: V.text, fontSize: 12, padding: 0 },
  toolRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  specChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.08)' },
  specChipText: { color: V.muted, fontSize: 9, fontWeight: '600' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, height: 34, borderRadius: 8, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: '#0d0805' },
  sortText: { color: V.text, fontSize: 11, fontWeight: '600', maxWidth: 150 },
  sortMenu: { borderRadius: 10, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: '#0d0805', overflow: 'hidden' },
  sortItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 11 },
  sortItemText: { color: V.muted, fontSize: 12, fontWeight: '600' },
  h2: { color: V.text, fontFamily: SERIF, fontSize: 24, lineHeight: 30, fontWeight: '600' },
  rule: { height: 1, backgroundColor: V.cardBorder, marginTop: 12 },
  linkRow: { alignSelf: 'flex-end', marginVertical: 12 },
  link: { color: V.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  lab: { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(10,6,3,0.7)' },
  sub: { color: V.muted, fontSize: 12, lineHeight: 18, marginTop: 10 },
  outlineBtn: { alignSelf: 'flex-start', marginTop: 14, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,90,31,0.5)' },
  outlineBtnText: { color: V.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  checks: { marginTop: 16, gap: 8, paddingTop: 14, borderTopWidth: 1, borderTopColor: V.cardBorder },
  check: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkText: { color: V.muted, fontSize: 11 },
  cta: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,90,31,0.25)', backgroundColor: V.card },
  ctaEyebrow: { color: V.orange, fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  ctaTitle: { color: V.text, fontFamily: SERIF, fontSize: 22, lineHeight: 28, fontWeight: '600', marginTop: 8 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 6 },
  emptyTitle: { color: V.text, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  emptySub: { color: V.muted, fontSize: 12 },
});
