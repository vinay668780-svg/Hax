import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEyeOffset,
  formatOdometerDigits,
  validateGuestbookInput,
  advanceEasterEggProgress,
  countSceneWords,
  formatReturningGreeting,
  generatePipDialogueReply,
  LULLABY_NOTES,
} from './dreamEngine.ts';

test('calculateEyeOffset returns zero offset when cursor is at eye center', () => {
  const offset = calculateEyeOffset(200, 200, 200, 200, 7);
  assert.deepEqual(offset, { x: 0, y: 0 });
});

test('calculateEyeOffset clamps pupil movement to maxRadius', () => {
  const offset = calculateEyeOffset(1000, 200, 200, 200, 7);
  assert.equal(offset.x, 7);
  assert.equal(offset.y, 0);
});

test('formatOdometerDigits pads visitor counts to 7 tabular digits', () => {
  assert.deepEqual(formatOdometerDigits(10428, 7), ['0', '0', '1', '0', '4', '2', '8']);
  assert.deepEqual(formatOdometerDigits(0, 5), ['0', '0', '0', '0', '0']);
});

test('validateGuestbookInput rejects empty fields and accepts valid entries', () => {
  const invalid = validateGuestbookInput({
    visitorName: '   ',
    creatureType: '',
    bedtimeWish: 'hi',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.visitorName);
  assert.ok(invalid.errors.creatureType);
  assert.ok(invalid.errors.bedtimeWish);

  const valid = validateGuestbookInput({
    visitorName: 'Barnaby Owl',
    creatureType: 'Night Watch Owlet',
    bedtimeWish: 'Please send a warm cinnamon cloud dream tonight!',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('advanceEasterEggProgress triggers unlock exactly on threshold click', () => {
  const step1 = advanceEasterEggProgress(0, 3);
  assert.equal(step1.unlocked, false);
  assert.equal(step1.justUnlocked, false);

  const step2 = advanceEasterEggProgress(1, 3);
  assert.equal(step2.unlocked, false);

  const step3 = advanceEasterEggProgress(2, 3);
  assert.equal(step3.unlocked, true);
  assert.equal(step3.justUnlocked, true);
});

test('countSceneWords counts words accurately and LULLABY_NOTES has 6 pentatonic notes', () => {
  assert.equal(countSceneWords('Good things start small in the Midnight Nursery.'), 8);
  assert.equal(countSceneWords('   '), 0);
  assert.equal(LULLABY_NOTES.length, 6);
});

test('formatReturningGreeting customizes first-visit vs returning-visit messages', () => {
  const firstVisit = formatReturningGreeting({
    visitCount: 1,
    visitorName: 'Mochi',
    creatureType: 'Dormouse',
    favoriteNote: 'G5',
    lastSeenIso: '2026-10-18T20:00:00Z',
    unlockedEasterEgg: false,
  });
  assert.ok(firstVisit.includes('First time in Attic Crib #4!'));
  assert.ok(firstVisit.includes('Mochi (Dormouse)'));

  const returningVisit = formatReturningGreeting({
    visitCount: 4,
    visitorName: 'Mochi',
    creatureType: 'Dormouse',
    favoriteNote: 'E5',
    lastSeenIso: '2026-10-18T20:00:00Z',
    unlockedEasterEgg: true,
  });
  assert.ok(returningVisit.includes('Welcome back, Mochi (Dormouse)!'));
  assert.ok(returningVisit.includes('Visit #4'));
  assert.ok(returningVisit.includes('Golden Dream Weaver'));
});

test('generatePipDialogueReply responds in Pip character voice with suggested notes', () => {
  const dreamReply = generatePipDialogueReply('I cannot sleep tonight, please send a dream', 'Barnaby', 'C5');
  assert.ok(dreamReply.reply.includes('Barnaby'));
  assert.equal(dreamReply.suggestedNote, 'A5');

  const spookReply = generatePipDialogueReply('Are you a scary skull monster?', 'Luna', 'C5');
  assert.ok(spookReply.reply.includes('never spooky'));
  assert.equal(spookReply.suggestedNote, 'D5');
});
