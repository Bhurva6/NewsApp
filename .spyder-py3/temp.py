# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import speech_recognition as sr
r=sr.Recognizer()
with sr.Microphone() as source:
    audio=r.listen(source)
try:
    print ("System predicts:"+r.recognize_google(audio))
except Exception:
    print("something is wrong")
    
