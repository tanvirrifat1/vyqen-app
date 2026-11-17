import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Placeholder } from '@/components/vyqen/parts';
import { formatPrice, V } from '@/constants/vyqen';
import { DELIVERY, useBag } from '@/store/bag';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

export default function BagScreen() {
  const { items, count, subtotal, discount, promo, setQty, remove, applyPromo } = useBag();
  const [code, setCode] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onApply = () => {
    if (!code.trim()) return;
    const ok = applyPromo(code);
    setPromoMsg(ok ? { ok, text: '15% atelier discount applied' } : { ok, text: 'Invalid promo code' });
  };

  const goCheckout = () => router.push('/checkout');

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#2a1408', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.hIcon}>
            <Icon name="shopping-outline" size={20} color={V.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.hTitle}>Your Atelier Bag</Text>
            <Text style={s.hSub}>{count} luminaire {count === 1 ? 'piece' : 'pieces'}</Text>
          </View>
          <Pressable onPress={() => goBack()} hitSlop={10}>
            <Icon name="close" size={22} color={V.muted} />
          </Pressable>
        </View>

        {/* Delivery banner */}
        <View style={s.banner}>
          <Icon name="truck-delivery-outline" size={16} color={V.orange} />
          <Text style={s.bannerText}>
            ডেলিভারি চার্জ: <Text style={s.bannerBold}>ঢাকার ভেতরে ৬০ টাকা | ঢাকার বাইরে ১২০ টাকা</Text>
          </Text>
        </View>

        {items.length === 0 ? (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Icon name="shopping-outline" size={34} color={V.dim} />
            </View>
            <Text style={s.emptyTitle}>Your bag is empty</Text>
            <Text style={s.emptySub}>Discover handcrafted luminaires and 3D printed docks.</Text>
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
            <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }} showsVerticalScrollIndicator={false}>
              {items.map((it) => (
                <View key={it.key} style={s.item}>
                  <Placeholder tint={it.tint} style={s.thumb} />
                  <View style={{ flex: 1 }}>
                    <View style={s.itemTop}>
                      <Text style={s.itemName} numberOfLines={2}>{it.name}</Text>
                      <Pressable onPress={() => remove(it.key)} hitSlop={10}>
                        <Icon name="close" size={16} color={V.muted} />
                      </Pressable>
                    </View>
                    <Text style={s.itemTemp}>{it.temp}</Text>
                    <View style={s.itemBottom}>
                      <View style={s.qty}>
                        <Pressable onPress={() => setQty(it.key, it.qty - 1)} hitSlop={8}>
                          <Icon name="minus" size={14} color={V.muted} />
                        </Pressable>
                        <Text style={s.qtyNum}>{it.qty}</Text>
                        <Pressable onPress={() => setQty(it.key, it.qty + 1)} hitSlop={8}>
                          <Icon name="plus" size={14} color={V.muted} />
                        </Pressable>
                      </View>
                      <Text style={s.itemPrice}>{formatPrice(it.price * it.qty)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Totals */}
            <View style={s.footer}>
              <View style={s.promoRow}>
                <TextInput
                  value={code}
                  onChangeText={(t) => {
                    setCode(t);
                    setPromoMsg(null);
                  }}
                  placeholder="Promo code (e.g. ORANGE15)"
                  placeholderTextColor={V.dim}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  style={s.promoInput}
                  onSubmitEditing={onApply}
                />
                <Pressable onPress={onApply} style={s.apply}>
                  <Text style={s.applyText}>Apply</Text>
                </Pressable>
              </View>
              {promoMsg ? (
                <Text style={[s.promoMsg, { color: promoMsg.ok ? '#2fd08a' : '#ff6b5a' }]}>{promoMsg.text}</Text>
              ) : null}

              <View style={s.line}>
                <Text style={s.lineLabel}>Subtotal</Text>
                <Text style={s.lineValue}>{formatPrice(subtotal)}</Text>
              </View>
              {discount > 0 ? (
                <View style={s.line}>
                  <Text style={s.lineLabel}>Promo ({promo})</Text>
                  <Text style={[s.lineValue, { color: '#2fd08a' }]}>− {formatPrice(discount)}</Text>
                </View>
              ) : null}
              <View style={[s.line, s.lineBorder]}>
                <Text style={s.lineLabel}>Delivery Charge</Text>
                <Text style={s.deliv}>Dhaka: {DELIVERY.dhaka} ৳ | Outside: {DELIVERY.outside} ৳</Text>
              </View>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Subtotal</Text>
                <Text style={s.totalValue}>{formatPrice(subtotal - discount)}</Text>
              </View>

              <Pressable onPress={goCheckout} style={({ pressed }) => pressed && { opacity: 0.88 }}>
                <LinearGradient colors={[V.orange, '#e8780a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
                  <Text style={s.ctaText}>Proceed to Checkout</Text>
                  <Icon name="arrow-right" size={16} color="#fff" />
                </LinearGradient>
              </Pressable>
              <Text style={s.note}>Guaranteed safe checkout & 5-year atelier warranty included.</Text>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: V.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14 },
  hIcon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.1)', alignItems: 'center', justifyContent: 'center' },
  hTitle: { color: V.text, fontFamily: SERIF, fontSize: 19, fontWeight: '700' },
  hSub: { color: V.amber, fontSize: 11, marginTop: 2 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 11, backgroundColor: 'rgba(255,90,31,0.1)', borderTopWidth: 1, borderBottomWidth: 1, borderColor: V.cardBorder },
  bannerText: { flex: 1, color: V.text, fontSize: 12 },
  bannerBold: { color: V.amber, fontWeight: '800' },
  item: { flexDirection: 'row', gap: 14 },
  thumb: { width: 80, height: 96, borderRadius: 12 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemName: { flex: 1, color: V.text, fontSize: 14, fontWeight: '800' },
  itemTemp: { color: '#d9944a', fontSize: 11, marginTop: 4 },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 10, height: 32, borderRadius: 8, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  qtyNum: { color: V.text, fontSize: 12, fontWeight: '800', minWidth: 12, textAlign: 'center' },
  itemPrice: { color: V.amber, fontSize: 15, fontWeight: '800' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: V.cardBorder, backgroundColor: 'rgba(10,6,3,0.6)' },
  promoRow: { flexDirection: 'row', gap: 10 },
  promoInput: { flex: 1, height: 44, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card, color: V.text, fontSize: 12 },
  apply: { paddingHorizontal: 18, height: 44, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,90,31,0.5)', backgroundColor: 'rgba(255,90,31,0.1)', alignItems: 'center', justifyContent: 'center' },
  applyText: { color: V.amber, fontSize: 12, fontWeight: '800' },
  promoMsg: { fontSize: 11, marginTop: 8 },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  lineBorder: { paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: V.cardBorder },
  lineLabel: { color: V.muted, fontSize: 12 },
  lineValue: { color: V.text, fontSize: 12, fontWeight: '800' },
  deliv: { color: V.amber, fontSize: 11, fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  totalLabel: { color: V.text, fontFamily: SERIF, fontSize: 18, fontWeight: '700' },
  totalValue: { color: V.amber, fontSize: 22, fontWeight: '800' },
  cta: { height: 54, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, boxShadow: '0 6px 20px rgba(255,90,31,0.35)' },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  note: { color: V.dim, fontSize: 10, textAlign: 'center', marginTop: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 30 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { color: V.text, fontFamily: SERIF, fontSize: 20, fontWeight: '700' },
  emptySub: { color: V.muted, fontSize: 12, textAlign: 'center' },
  ghost: { marginTop: 14, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,90,31,0.5)' },
  ghostText: { color: V.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
