<?php
// Simple demo contact handler (no mail server).
// In production, replace with proper mail() or API and validation.
header('Content-Type: application/json; charset=utf-8');
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  echo json_encode(['ok'=>false,'msg'=>'POST only']); exit;
}
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'رسالة تواصل';
$message = $_POST['message'] ?? '';
if(!$name || !$phone || !$message){
  echo json_encode(['ok'=>false,'msg'=>'بيانات ناقصة']); exit;
}
$record = [
  'time'=>date('c'),
  'name'=>$name,
  'phone'=>$phone,
  'email'=>$email,
  'subject'=>$subject,
  'message'=>$message,
  'ip'=>$_SERVER['REMOTE_ADDR'] ?? '']
;
$file = __DIR__ . '/contact_messages.json';
$all = [];
if(file_exists($file)){
  $all = json_decode(file_get_contents($file), true) ?: [];
}
$all[] = $record;
file_put_contents($file, json_encode($all, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
echo json_encode(['ok'=>true,'msg'=>'تم الاستلام']); exit;
