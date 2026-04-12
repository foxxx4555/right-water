import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ULTRAMSG_INSTANCE_ID = Deno.env.get("ULTRAMSG_INSTANCE_ID")
const ULTRAMSG_TOKEN = Deno.env.get("ULTRAMSG_TOKEN")

serve(async (req) => {
  try {
    const { record, old_record, type } = await req.json()
    
    let message = ""
    let recipientPhone = record.customer_phone
    const name = record.customer_name || 'عميلنا العزيز'
    const orderId = record.id

    // Formatting Phone number (Adding '2' for Egypt if needed)
    let phone = recipientPhone.replace(/\D/g, '')
    if (phone.startsWith('01') && phone.length === 11) {
      phone = '2' + phone
    }

    // Logic based on Type (INSERT / UPDATE)
    if (type === 'INSERT') {
      // NEW ORDER - Notification to Representative
      message = `📦 *طلب جديد من العميل:* ${name}\n`
      message += `📱 *الهاتف:* ${recipientPhone}\n`
      message += `📍 *العنوان:* ${record.customer_address}\n\n`
      message += `🔍 *المنتجات:* ${JSON.stringify(record.items)}\n`
      message += `💰 *الإجمالي:* ${record.total_amount} ج.م`
      
      // Send to Representative (Hardcoded for now as per previous requirement)
      await sendWhatsApp('201024326713', message)
      
    } else if (type === 'UPDATE' && record.status !== old_record.status) {
      // STATUS CHANGE - Notification to Customer
      switch (record.status) {
        case 'processing':
          message = `🌀 *تنبيه من رايت ووتر*\n\nمرحباً ${name}، جاري الآن تجهيز طلبكم رقم (${orderId}) وسنقوم بإبلاغكم بموعد الشحن قريباً.`
          break;
        case 'completed':
          message = `✅ *تم اكتمال طلبكم*\n\nمرحباً ${name}، تم تجهيز الأوردر رقم (${orderId}) بالكامل وسيصلكم المندوب قريباً للتسليم.`
          break;
        case 'cancelled':
          message = `❌ *تم إلغاء الطلب*\n\nمرحباً ${name}، تم إلغاء طلبكم رقم (${orderId}).`
          break;
      }
      
      if (message) {
        await sendWhatsApp(phone, message)
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
})

async function sendWhatsApp(to: string, msg: string) {
  const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`
  const params = new URLSearchParams({
    token: ULTRAMSG_TOKEN || "",
    to: to,
    body: msg,
    priority: "1"
  })

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  })
}
