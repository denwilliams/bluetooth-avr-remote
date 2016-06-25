#include <SoftwareSerial.h>
SoftwareSerial BTserial(5,6); // RX | TX
char c = ' ';

//these pins can not be changed 2/3 are special pins
int encoderPin1 = 3;
int encoderPin2 = 2;
int encoderSwitchPin = 8;
int max = 1000;

volatile int lastEncoded = 0;
volatile long encoderValue = 0;

long lastencoderValue = 0;
bool lastButton = false;

int lastMSB = 0;
int lastLSB = 0;

void setup() {
  Serial.begin (9600);
  BTserial.begin(9600);  

  pinMode(encoderPin1, INPUT); 
  pinMode(encoderPin2, INPUT);
  pinMode(encoderSwitchPin, INPUT);

  digitalWrite(encoderPin1, HIGH); //turn pullup resistor on
  digitalWrite(encoderPin2, HIGH); //turn pullup resistor on
  digitalWrite(encoderSwitchPin, HIGH); //turn pullup resistor on

  //call updateEncoder() when any high/low changed seen
  //on interrupt 0 (pin 2), or interrupt 1 (pin 3) 
  attachInterrupt(0, updateEncoder, CHANGE); 
  attachInterrupt(1, updateEncoder, CHANGE);

  Serial.println("INIT");
  BTserial.println("INIT");
}

void loop(){ 
  if (encoderValue != 0) {
    Serial.print("ADJ ");
    Serial.println(encoderValue);
    
    BTserial.print("ADJ ");
    BTserial.println(encoderValue);
    
    encoderValue = 0;
  }v

  //Do stuff here
  if(digitalRead(encoderSwitchPin)){
    //button is not being pushed
    if (lastButton) {
      lastButton = false;
      Serial.println("BTN_UP");
      BTserial.println("BTN_UP");
    }
  }else{
    //button is being pushed
    if (!lastButton) {
      lastButton = true;
      Serial.println("BTN_DN");
      BTserial.println("BTN_DN");
    }
  }

  delay(50); //just here to slow down the output, and show it will work  even during a delay
}


void updateEncoder(){
//  Serial.println("updateEncoder");

  int MSB = digitalRead(encoderPin1); //MSB = most significant bit
  int LSB = digitalRead(encoderPin2); //LSB = least significant bit

  int encoded = (MSB << 1) |LSB; //converting the 2 pin value to single number
  int sum  = (lastEncoded << 2) | encoded; //adding it to the previous encoded value

  if(sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011) encoderValue ++;
  if(sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000) encoderValue --;

//  if (encoderValue > max) encoderValue = max;
//  else if (encoderValue < 0) encoderValue = 0;

  lastEncoded = encoded; //store this value for next time
}
