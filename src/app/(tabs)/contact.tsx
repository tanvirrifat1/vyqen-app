import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
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

import { AppHeader, Footer, PAD, TrustStrip } from '@/components/vyqen/chrome';
import { Eyebrow } from '@/components/vyqen/parts';
import { BottomTabInset } from '@/constants/theme';
import { V } from '@/constants/vyqen';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

type IconName = React.ComponentProps<typeof Icon>['name'];

const PHONE = '+8801904482088';
const EMAIL = 'vyqen.tech@gmail.com';

const FAQS = [
  {
    q: 'Are Vyqen luminaires compatible with universal voltages (110V and 220V - 240V)?',
    a: 'Yes. All our integrated LED drivers and transformers operate flawlessly across standard 100V–240V international grids. We automatically ship appropriate power cords and regional canopy mounts based on your delivery country.',
  },
  {
    q: 'Can I commission bespoke drop lengths for double-height atriums or stairwells?',
    a: 'Absolutely. Our atelier tailors suspension lengths, canopy finishes and glass sizing for atriums and stairwells. Share your ceiling height and we will send a drawing for approval.',
  },
  {
    q: 'What is your coverage if a mouth-blown glass shade is damaged during shipping?',
    a: 'Every shipment is fully insured with white-glove transit. If a shade arrives damaged, send us photos within 48 hours and we will replace it at no cost.',
  },
  {
    q: 'Are the LEDs dimmable with standard wall switches or smart home systems (Lutron, Caseta, DALI)?',
    a: 'Our flicker-free warm LEDs support leading-edge and trailing-edge dimmers, and are compatible with Lutron, Caseta and DALI systems. Table lamps include a built-in capacitive touch-dimmer.',
  },
  {
    q: 'Do you offer trade discounts for interior designers and architects?',
    a: 'Yes. Our trade program offers tiered pricing, customised canopy fabrications, photometric IES files and finish samples. Apply for trade credentials below.',
  },
];

function Field({ label, ...rest }: { label: string } & TextInputProps) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput placeholderTextColor={V.dim} style={[s.input, rest.multiline && s.textarea]} {...rest} />
    </View>
  );
}

function ContactRow({
  icon,
  label,
  value,
  note,
  action,
  onAction,
}: {
  icon: IconName;
  label: string;
  value: string;
  note: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.cRow}>
      <View style={s.cIcon}>
        <Icon name={icon} size={16} color={V.orange} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.cLabel}>{label}</Text>
        <Text style={s.cValue}>{value}</Text>
        {action ? (
          <Pressable onPress={onAction}>
            <Text style={s.link}>{action} →</Text>
          </Pressable>
        ) : null}
        <Text style={s.cNote}>{note}</Text>
      </View>
    </View>
  );
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!isEmail(email)) e.email = 'Enter a valid email address';
    if (!message.trim()) e.message = 'Please describe your inquiry';
    setErrors(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
    setSent(false);
  };

  const whatsapp = () => Linking.openURL(`https://wa.me/${PHONE.replace('+', '')}`).catch(() => {});

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#3a1a08', V.bg, '#2a1206', V.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <AppHeader />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: BottomTabInset + 24 }}>
            {/* Hero */}
            <View style={s.pad}>
              <LinearGradient colors={['#1d120a', '#0f0805']} style={s.hero}>
                <View style={s.tag}>
                  <Icon name="star-four-points" size={10} color={V.orange} />
                  <Text style={s.tagText}>PRIVATE CONCIERGE & TRADE STUDIO</Text>
                </View>
                <Text style={s.heroTitle}>
                  Your Space, <Text style={s.italic}>Your Story.</Text>
                </Text>
                <Text style={s.heroSub}>
                  Whether inquiring about an existing luminaire, commissioning a custom architectural chandelier, or booking an atelier walkthrough, our lighting architects are at your service.
                </Text>
              </LinearGradient>
            </View>

            {/* Form */}
            <View style={[s.pad, { marginTop: 24 }]}>
              <View style={s.card}>
                <Eyebrow>SEND A MESSAGE</Eyebrow>
                <Text style={s.h2}>Get In Touch</Text>

                {sent ? (
                  <View style={s.success}>
                    <View style={s.successIcon}>
                      <Icon name="check" size={26} color="#fff" />
                    </View>
                    <Text style={s.successTitle}>Message ready, {name.trim().split(' ')[0]}.</Text>
                    <Text style={s.successSub}>
                      Thank you for reaching out. Our atelier concierge will reply to {email.trim()} within 2 hours.
                    </Text>
                    <Pressable onPress={reset} style={s.ghost}>
                      <Text style={s.ghostText}>SEND ANOTHER MESSAGE</Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <View style={{ gap: 14, marginTop: 16 }}>
                      <View>
                        <Field label="Your Name *" value={name} onChangeText={setName} placeholder="e.g. Rifat Miah" autoCapitalize="words" />
                        {errors.name ? <Text style={s.err}>{errors.name}</Text> : null}
                      </View>
                      <View>
                        <Field
                          label="Email Address *"
                          value={email}
                          onChangeText={setEmail}
                          placeholder="e.g. vyqen.tech@gmail.com"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        {errors.email ? <Text style={s.err}>{errors.email}</Text> : null}
                      </View>
                      <Field label="Phone / WhatsApp Number" value={phone} onChangeText={setPhone} placeholder="01904482088" keyboardType="phone-pad" />
                      <View>
                        <Field
                          label="Description *"
                          value={message}
                          onChangeText={setMessage}
                          placeholder="Write your message, inquiries, or requirements here…"
                          multiline
                          textAlignVertical="top"
                        />
                        {errors.message ? <Text style={s.err}>{errors.message}</Text> : null}
                      </View>
                    </View>
                    <Pressable onPress={submit} style={({ pressed }) => [{ marginTop: 18 }, pressed && { opacity: 0.85 }]}>
                      <LinearGradient colors={[V.orange, V.amber]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.send}>
                        <Text style={s.sendText}>SEND MESSAGE</Text>
                        <Icon name="arrow-right" size={14} color="#fff" />
                      </LinearGradient>
                    </Pressable>
                    <View style={s.privacy}>
                      <Icon name="shield-check-outline" size={12} color={V.orange} />
                      <Text style={s.privacyText}>Strict privacy guaranteed. We never share client interior data.</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Direct contact */}
            <View style={[s.pad, { marginTop: 16 }]}>
              <View style={s.card}>
                <Eyebrow>DIRECT CONTACT</Eyebrow>
                <Text style={s.h2}>Atelier Concierge</Text>
                <View style={{ gap: 18, marginTop: 16 }}>
                  <ContactRow
                    icon="phone-outline"
                    label="Phone & WhatsApp"
                    value="+880 1904-482088 / 01904482088"
                    action="Direct WhatsApp Message"
                    onAction={whatsapp}
                    note="Mon–Sat, 10:00 AM – 8:00 PM BST"
                  />
                  <Pressable onPress={() => Linking.openURL(`mailto:${EMAIL}`).catch(() => {})}>
                    <ContactRow icon="email-outline" label="Electronic Mail" value={EMAIL} note="Average response time: 2 hours" />
                  </Pressable>
                  <ContactRow
                    icon="map-marker-outline"
                    label="Studio & Atelier"
                    value={'60 Feet Road, Mirpur\nDhaka, Bangladesh'}
                    note="Visits & pickups by appointment"
                  />
                </View>
              </View>
            </View>

            {/* Trade */}
            <View style={[s.pad, { marginTop: 16 }]}>
              <LinearGradient colors={['#2a1408', '#0f0805']} style={[s.card, { borderColor: 'rgba(255,90,31,0.3)' }]}>
                <View style={s.tradeHead}>
                  <Icon name="star-four-points" size={12} color={V.orange} />
                  <Text style={s.tradeTitle}>TRADE PROGRAM FOR ARCHITECTS</Text>
                </View>
                <Text style={s.tradeText}>
                  Are you an architect or interior design firm? Join our trade network for exclusive tier pricing, customized canopy fabrications, photometrics IES files, and finish samples.
                </Text>
                <Pressable onPress={() => Linking.openURL(`mailto:${EMAIL}?subject=Trade%20Credentials`).catch(() => {})}>
                  <Text style={[s.link, { marginTop: 14 }]}>Apply for Trade Credentials →</Text>
                </Pressable>
              </LinearGradient>
            </View>

            {/* FAQ */}
            <View style={[s.pad, { marginTop: 40, alignItems: 'center' }]}>
              <Eyebrow>COMMON INQUIRIES</Eyebrow>
              <Text style={s.h2}>Frequently Asked Questions</Text>
            </View>
            <View style={[s.pad, { gap: 10, marginTop: 18 }]}>
              {FAQS.map((f, i) => {
                const on = open === i;
                return (
                  <Pressable key={f.q} onPress={() => setOpen(on ? null : i)} style={[s.faq, on && s.faqOn]}>
                    <View style={s.faqHead}>
                      <Text style={s.faqQ}>{f.q}</Text>
                      <View style={s.faqBtn}>
                        <Icon name={on ? 'minus' : 'plus'} size={14} color={V.orange} />
                      </View>
                    </View>
                    {on ? <Text style={s.faqA}>{f.a}</Text> : null}
                  </Pressable>
                );
              })}
            </View>

            <TrustStrip />
            <Footer />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: V.bg },
  pad: { paddingHorizontal: PAD },
  hero: { padding: 22, borderRadius: 20, borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.08)', marginBottom: 14 },
  tagText: { color: V.orange, fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: V.text, fontFamily: SERIF, fontSize: 32, lineHeight: 40, fontWeight: '600', textAlign: 'center' },
  italic: { color: V.amber, fontStyle: 'italic', fontWeight: '500' },
  heroSub: { color: V.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 12 },
  card: { padding: 18, borderRadius: 20, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: 'rgba(20,12,7,0.9)' },
  h2: { color: V.text, fontFamily: SERIF, fontSize: 24, lineHeight: 30, fontWeight: '600' },
  label: { color: V.text, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: { color: V.text, fontSize: 13, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: '#0d0805' },
  textarea: { minHeight: 110 },
  err: { color: '#ff6b5a', fontSize: 11, marginTop: 5 },
  send: { height: 50, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 18px rgba(255,90,31,0.4)' },
  sendText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 },
  privacyText: { color: V.dim, fontSize: 10, flexShrink: 1 },
  success: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  successIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: V.orange, alignItems: 'center', justifyContent: 'center' },
  successTitle: { color: V.text, fontFamily: SERIF, fontSize: 20, fontWeight: '700', marginTop: 6 },
  successSub: { color: V.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  ghost: { marginTop: 10, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: V.cardBorder },
  ghostText: { color: V.text, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cRow: { flexDirection: 'row', gap: 12 },
  cIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,90,31,0.4)', backgroundColor: 'rgba(255,90,31,0.1)', alignItems: 'center', justifyContent: 'center' },
  cLabel: { color: V.muted, fontSize: 11 },
  cValue: { color: V.text, fontSize: 13, fontWeight: '800', marginTop: 2, lineHeight: 19 },
  cNote: { color: V.dim, fontSize: 10, marginTop: 3 },
  link: { color: V.orange, fontSize: 11, fontWeight: '800', marginTop: 4 },
  tradeHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tradeTitle: { color: V.amber, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  tradeText: { color: V.text, fontSize: 12, lineHeight: 19, marginTop: 10, opacity: 0.9 },
  faq: { borderRadius: 14, borderWidth: 1, borderColor: V.cardBorder, backgroundColor: V.card, padding: 16 },
  faqOn: { borderColor: 'rgba(255,90,31,0.35)' },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  faqQ: { flex: 1, color: V.text, fontFamily: SERIF, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  faqBtn: { width: 26, height: 26, borderRadius: 7, borderWidth: 1, borderColor: V.cardBorder, alignItems: 'center', justifyContent: 'center' },
  faqA: { color: V.muted, fontSize: 12, lineHeight: 19, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: V.cardBorder },
});
