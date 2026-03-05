import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from PIL import Image, ImageDraw, ImageFont
from aiogram.types import FSInputFile

# --- SOZLAMALAR ---
API_TOKEN = '8622554381:AAFMQ3qbIzFdLiOo7FHuC06Q3H7zzV_MAC8'
ADMIN_IDS = [6060353145, 6543167443, 123456789] # 3 ta admin ID
LOG_CHANNEL_ID = "-1002441858004" # O'z kanal ID-ingizni kiriting

bot = Bot(token=API_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

class CheckForm(StatesGroup):
    summa = State()
    sana_vaqt = State()
    kimga = State()
    karta = State()

# --- SAYTDAN KELGAN MA'LUMOTLARNI QABUL QILISH ---
# Eslatma: Saytdagi JavaScript orqali to'g'ridan-to'g'ri Telegram API ga yuboriladi. 
# Bu bot esa faqat chek yasash va admin boshqaruvi uchun.

@dp.message(Command("start"))
async def start_cmd(message: types.Message, state: FSMContext):
    if message.from_user.id not in ADMIN_IDS:
        return
    await message.answer("<b>ADMIN PANEL 👾</b>\n\nTo'lov summasini kiriting:", parse_mode="HTML")
    await state.set_state(CheckForm.summa)

@dp.message(CheckForm.summa)
async def process_sum(message: types.Message, state: FSMContext):
    await state.update_data(summa=message.text)
    await message.answer("Sana va vaqt (masalan: 09 fev 19:15):")
    await state.set_state(CheckForm.sana_vaqt)

@dp.message(CheckForm.sana_vaqt)
async def process_date(message: types.Message, state: FSMContext):
    await state.update_data(sana=message.text)
    await message.answer("Kimga (F.I.O):")
    await state.set_state(CheckForm.kimga)

@dp.message(CheckForm.kimga)
async def process_name(message: types.Message, state: FSMContext):
    await state.update_data(kimga=message.text.upper()) # Ismni katta harflarda qiladi
    await message.answer("Karta raqami (masalan: 860014****9860):")
    await state.set_state(CheckForm.karta)

@dp.message(CheckForm.karta)
async def finalize_check(message: types.Message, state: FSMContext):
    data = await state.get_data()
    karta = message.text
    await message.answer("⌛ Chek tayyorlanmoqda...")

    try:
        img = Image.open("shablon.png").convert("RGB")
        draw = ImageDraw.Draw(img)
        
        # MacBook MacBook i9 shriftlari
        font_path = "/Library/Fonts/Arial.ttf"
        try:
            f_summa = ImageFont.truetype(font_path, 85) # Summa uchun katta
            f_valyuta = ImageFont.truetype(font_path, 40) # "so'm" uchun
            f_sana = ImageFont.truetype(font_path, 32) # Sana
            f_info = ImageFont.truetype(font_path, 42) # Ism va Karta
        except:
            f_summa = f_valyuta = f_sana = f_info = ImageFont.load_default()

        # KOORDINATALAR (Namunaga asosan aniqlandi)
        # 1. Sana
        draw.text((540, 345), data['sana'], fill=(170, 170, 170), font=f_sana, anchor="mm")
        
        # 2. Summa (Markazlashtirilgan)
        sum_text = data['summa']
        draw.text((515, 410), sum_text, fill=(255, 255, 255), font=f_summa, anchor="rm")
        draw.text((535, 415), "so'm", fill=(170, 170, 170), font=f_valyuta, anchor="lm")
        
        # 3. Ism va Karta
        draw.text((230, 485), data['kimga'], fill=(255, 255, 255), font=f_info)
        draw.text((230, 535), karta, fill=(140, 140, 140), font=f_info)

        img.save("result.jpg", quality=95)
        
        photo = FSInputFile("result.jpg")
        caption = "✅ To'lov muvaffaqiyatli amalga oshirildi."
        
        # Adminga yuborish
        await bot.send_photo(message.chat.id, photo, caption=caption)
        
        # Kanalga nusxasini yuborish
        await bot.send_photo(chat_id=LOG_CHANNEL_ID, photo=photo, caption=f"Yangi chek yaratildi!\nKimga: {data['kimga']}")
            
    except Exception as e:
        await message.answer(f"Xato: {e}")
    
    await state.clear()

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())