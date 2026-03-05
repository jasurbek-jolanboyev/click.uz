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
ADMIN_IDS = [6060353145, 6543167443] 

bot = Bot(token=API_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

class CheckForm(StatesGroup):
    summa = State()
    sana_vaqt = State()
    kimga = State()
    karta = State()

@dp.message(Command("start"))
async def start_cmd(message: types.Message, state: FSMContext):
    if message.from_user.id not in ADMIN_IDS:
        return
    await message.answer("<b>ADMIN PANEL</b>\n\nSummani kiriting (masalan: 191 600):", parse_mode="HTML")
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
    await state.update_data(kimga=message.text.upper())
    await message.answer("Karta raqami (masalan: 860014****9860):")
    await state.set_state(CheckForm.karta)

@dp.message(CheckForm.karta)
async def finalize_check(message: types.Message, state: FSMContext):
    data = await state.get_data()
    karta = message.text
    await message.answer("⌛ MacBook i9 quvvatida chek tayyorlanmoqda...")

    try:
        img = Image.open("shablon.png").convert("RGB")
        W, H = img.size # Rasm o'lchamini aniqlaymiz
        draw = ImageDraw.Draw(img)
        
        # Shriftlar yo'li
        font_path = "/System/Library/Fonts/Supplemental/Arial.ttf"
        
        try:
            # Rasm katta bo'lgani uchun shriftlarni ham kattalashtirdik
            f_summa = ImageFont.truetype(font_path, 110) 
            f_valyuta = ImageFont.truetype(font_path, 60)
            f_sana = ImageFont.truetype(font_path, 45)
            f_name = ImageFont.truetype(font_path, 48)
            f_card = ImageFont.truetype(font_path, 42)
        except:
            f_summa = f_valyuta = f_sana = f_name = f_card = ImageFont.load_default()

        # --- YANGI KOORDINATALAR (1080x2400 o'lchamga mos) ---
        # 1. Sana
        draw.text((W/2, 825), data['sana'], fill=(150, 150, 150), font=f_sana, anchor="mm")
        
        # 2. Summa
        sum_val = data['summa']
        draw.text((W/2 - 50, 950), sum_val, fill=(255, 255, 255), font=f_summa, anchor="rm")
        draw.text((W/2 - 20, 955), "so'm", fill=(150, 150, 150), font=f_valyuta, anchor="lm")
        
        # 3. Kimga va Karta (Karta belgisi yoniga)
        draw.text((250, 1100), data['kimga'], fill=(255, 255, 255), font=f_name)
        draw.text((250, 1170), karta, fill=(130, 130, 130), font=f_card)

        img.save("result.jpg", quality=100)
        photo = FSInputFile("result.jpg")
        
        # FAQAT ADMINGA YUBORAMIZ (Kanalga yuborish olib tashlandi)
        await bot.send_photo(message.chat.id, photo, caption="✅ Chek tayyor!")
            
    except Exception as e:
        await message.answer(f"Xato: {e}")
    
    await state.clear()

async def main():
    logging.info("Bot ishga tushdi...")
    await dp.start_polling(bot)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())