import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatPrice, V } from '@/constants/vyqen';
import { DELIVERY, useBag } from '@/store/bag';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

type Zone = 'dhaka' | 'outside';

const ZONES: { key: Zone; bn: string; en: string; fee: number; eta: string; zoneLabel: string; etaLabel: string }[] = [
  { key: 'dhaka', bn: 'ঢাকার ভেতরে', en: 'Inside Dhaka (24-48h)', fee: DELIVERY.dhaka, eta: '24-48 Hours', zoneLabel: 'Inside Dhaka', etaLabel: 'Within 24-48 Hours (Dhaka)' },
  { key: 'outside', bn: 'ঢাকার বাইরে', en: 'Outside Dhaka (2-3d)', fee: DELIVERY.outside, eta: '2-3 Days', zoneLabel: 'Outside Dhaka', etaLabel: 'Within 2-3 Days' },
];

type Order = { ref: string; name: string; email: string; city: string; zone: (typeof ZONES)[number] };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Field({ label, error, style, ...rest }: { label: string; error?: string } & TextInputProps) {
  return (
    <View style={style}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={V.dim}
        style={[s.input, rest.multiline && { minHeight: 80, paddingTop: 12 }, !!error && { borderColor: '#ff6b5a' }]}
        {...rest}
      />
      {error ? <Text style={s.err}>{error}</Text> : null}
    </View>
  );
}

export default function CheckoutScreen() {
  const { items, types, subtotal, discount, clear } = useBag();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');
  const [zone, setZone] = useState<Zone>('dhaka');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<Order | null>(null);

  const z = ZONES.find((x) => x.key === zone)!;
  const total = subtotal - discount + z.fee;

  const confirm = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Required';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number';
    if (!isEmail(email)) e.email = 'Enter a valid email';
    if (!city.trim()) e.city = 'Required';
    if (!street.trim()) e.street = 'Required';
    setErrors(e);
    if (Object.keys(e).length) return;

    setOrder({
      ref: `VYQ-${Math.floor(100000 + Math.random() * 900000)}`,
      name: name.trim(),
      email: email.trim(),
      city: city.trim(),
      zone: z,
    });
    clear();
  };

  const finish = () => {
    router.dismissAll();
    router.navigate('/collection');
  };

  const close = () => (order ? finish() : goBack());

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#2a1408', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.header}>
          <View style={s.hIcon}>
            <Icon name="shield-check-outline" size={20} color={V.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.hTitle}>Atelier Concierge Checkout</Text>
            <Text style={s.hSub}>Secured 256-bit encrypted transaction</Text>
          </View>
          <Pressable onPress={close} hitSlop={10}>
            <Icon name="close" size={22} color={V.muted} />
          </Pressable>
        </View>

        {order ? (
          <ScrollView contentContainerStyle={s.confirm} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[V.orange, V.amber]} style={s.check}>
              <Icon name="check" size={34} color="#fff" />
            </LinearGradient>
            <Text style={s.confirmEyebrow}>COMMISSION CONFIRMED</Text>
            <Text style={s.thanks}>Thank You, {order.name}</Text>
            <Text style={s.thanksSub}>Your bespoke luminaires have been scheduled for dispatch.</Text>

            <View style={s.receipt}>
              <Row label="Order Reference:" value={order.ref} gold />
              <Row label="Shipping To:" value={`${order.city}, Bangladesh`} />
              <Row label="Delivery Zone:" value={`${order.zone.zoneLabel} (${order.zone.fee} Tk)`} accent />
              <View style={s.rule} />
              <Row label="Estimated Delivery:" value={order.zone.etaLabel} gold />
            </View>

            <View style={s.tracking}>
              <Icon name="truck-delivery-outline" size={14} color={V.orange} />
              <Text style={s.trackingText}>Tracking details sent to {order.email}</Text>
            </View>

            <Pressable onPress={finish} style={({ pressed }) => [{ marginTop: 22 }, pressed && { opacity: 0.88 }]}>
              <LinearGradient colors={[V.orange, '#ff7a2f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.continueBtn}>
                <Text style={s.continueText}>Continue Exploring Collection</Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        ) : items.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyTitle}>Your bag is empty</Text>
            <Pressable onPress={() => goBack()} style={s.ghost}>
              <Text style={s.ghostText}>BACK TO BAG</Text>
            </Pressable>
          </View>
        ) : (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
              <Text style={s.section}>1. DELIVERY DESTINATION (ডেলিভারি ঠিকানা)</Text>
              <View style={{ gap: 14 }}>
                <Field label="Full Name" value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" />
                <Field label="Contact Phone" value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" />
                <Field label="Email Address" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                <Field label="City / Region" value={city} onChangeText={setCity} error={errors.city} autoCapitalize="words" />
                <Field label="Street Address" value={street} onChangeText={setStreet} error={errors.street} />
                <Field
                  label="Description / Order Notes (অর্ডার বিবরণ বা বিশেষ নির্দেশনা)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any specific instructions, landmark details, or color preference..."
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={s.zoneHead}>
                <Text style={[s.section, { marginTop: 0, marginBottom: 0 }]}>2. DELIVERY AREA & CHARGES (ডেলিভারি চার্জ)</Text>
              </View>
              <Text style={s.zoneNote}>ঢাকার ভেতরে ৬০৳ | বাইরে ১২০৳</Text>
              <View style={s.zones}>
                {ZONES.map((o) => {
                  const on = o.key === zone;
                  return (
                    <Pressable key={o.key} onPress={() => setZone(o.key)} style={[s.zone, on && s.zoneOn]}>
                      <View style={s.zoneTop}>
                        <Text style={s.zoneBn}>{o.bn}</Text>
                        <Text style={s.zoneFee}>{o.fee} Tk</Text>
                      </View>
                      <Text style={s.zoneEn}>{o.en}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={s.summary}>
                <View style={s.sRow}>
                  <Text style={s.sLabel}>Items Subtotal ({types} {types === 1 ? 'type' : 'types'})</Text>
                  <Text style={s.sValue}>{formatPrice(subtotal)}</Text>
                </View>
                {discount > 0 ? (
                  <View style={s.sRow}>
                    <Text style={s.sLabel}>Promo discount</Text>
                    <Text style={[s.sValue, { color: '#2fd08a' }]}>− {formatPrice(discount)}</Text>
                  </View>
                ) : null}
                <View style={[s.sRow, s.sBorder]}>
                  <Text style={s.sLabel}>Delivery Charge</Text>
                  <Text style={s.sGold}>{z.fee} ৳ ({z.key === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})</Text>
                </View>
                <View style={[s.sRow, { marginTop: 12 }]}>
                  <Text style={s.totalLabel}>Total Amount Due</Text>
                  <Text style={s.totalValue}>{formatPrice(total)}</Text>
                </View>
              </View>

              <Pressable onPress={confirm} style={({ pressed }) => [{ marginTop: 18 }, pressed && { opacity: 0.88 }]}>
                <LinearGradient colors={[V.orange, '#e8780a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
                  <Text style={s.ctaText}>Confirm Order • অর্ডার সম্পন্ন করুন</Text>
                </LinearGradient>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
}

function Row({ label, value, gold, accent }: { label: string; value: string; gold?: boolean; accent?: boolean }) {
  return (
    <View style={s.rRow}>
      <Text style={s.rLabel}>{label}</Text>
      <Text style={[s.rValue, gold && { color: V.amber }, accent && { color: '#d9944a' }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: V.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: V.cardBorder },
  hIcon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.1)', alignItems: 'center', justifyContent: 'center' },
  hTitle: { color: V.text, fontFamily: SERIF, fontSize: 18, fontWeight: '700' },
  hSub: { color: '#d9944a', fontSize: 10, marginTop: 2 },
  section: { color: V.orange, fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginBottom: 14 },
  label: { color: V.text, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  input: { color: V.text, fontSize: 13, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  err: { color: '#ff6b5a', fontSize: 11, marginTop: 5 },
  zoneHead: { marginTop: 26 },
  zoneNote: { color: V.amber, fontSize: 11, fontWeight: '700', marginTop: 6, marginBottom: 12 },
  zones: { flexDirection: 'row', gap: 10 },
  zone: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card },
  zoneOn: { borderColor: V.orange, backgroundColor: 'rgba(255,90,31,0.14)' },
  zoneTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  zoneBn: { color: V.text, fontSize: 13, fontWeight: '800', flexShrink: 1 },
  zoneFee: { color: V.amber, fontSize: 12, fontWeight: '800' },
  zoneEn: { color: V.dim, fontSize: 10, marginTop: 4 },
  summary: { marginTop: 18, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: '#0d0805' },
  sRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 10 },
  sBorder: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: V.cardBorder },
  sLabel: { color: V.muted, fontSize: 12, flexShrink: 1 },
  sValue: { color: V.text, fontSize: 12, fontWeight: '800' },
  sGold: { color: V.amber, fontSize: 12, fontWeight: '800' },
  totalLabel: { color: V.amber, fontFamily: SERIF, fontSize: 16, fontWeight: '700' },
  totalValue: { color: V.amber, fontSize: 22, fontWeight: '800' },
  cta: { height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,90,31,0.35)' },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  emptyTitle: { color: V.text, fontFamily: SERIF, fontSize: 20, fontWeight: '700' },
  ghost: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,90,31,0.5)' },
  ghostText: { color: V.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  confirm: { alignItems: 'center', padding: 24, paddingTop: 36 },
  check: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(255,90,31,0.45)' },
  confirmEyebrow: { color: V.amber, fontSize: 12, fontWeight: '800', letterSpacing: 1.6, marginTop: 22 },
  thanks: { color: V.text, fontFamily: SERIF, fontSize: 28, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  thanksSub: { color: V.muted, fontSize: 12, marginTop: 8, textAlign: 'center' },
  receipt: { alignSelf: 'stretch', marginTop: 22, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: '#0d0805', gap: 10 },
  rRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  rLabel: { color: V.muted, fontSize: 12 },
  rValue: { color: V.text, fontSize: 12, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
  rule: { height: 1, backgroundColor: V.cardBorder },
  tracking: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  trackingText: { color: V.muted, fontSize: 11, flexShrink: 1 },
  continueBtn: { paddingHorizontal: 26, paddingVertical: 15, borderRadius: 999, boxShadow: '0 6px 20px rgba(255,90,31,0.4)' },
  continueText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});
