/**
 * AutoPilot 工具函数测试
 *
 * @author Astral
 * @version 1.0.0
 */

const {
  randomString,
  randomInt,
  uuid,
  guid,
  randomMac,
  maskPhone,
  maskEmail,
  timestamp,
  timestampToDate,
  dateToTimestamp,
  currentDate,
  currentTime,
  currentDateTime,
  md5,
  sha1,
  sha256,
  base64Encode,
  base64Decode,
  isEmpty,
  isJson,
  deepClone,
  unique,
  groupBy,
  sortBy,
  randomItem,
  shuffle,
} = require('../scripts/utils/common');

describe('工具函数测试', () => {
  describe('字符串生成', () => {
    test('randomString 应该生成指定长度的随机字符串', () => {
      const str = randomString(10);
      expect(str).toHaveLength(10);
      expect(typeof str).toBe('string');
    });

    test('randomInt 应该生成指定范围内的随机整数', () => {
      const num = randomInt(1, 10);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(10);
      expect(Number.isInteger(num)).toBe(true);
    });

    test('uuid 应该生成有效的 UUID', () => {
      const id = uuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('guid 应该生成有效的 GUID', () => {
      const id = guid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    test('randomMac 应该生成有效的 MAC 地址', () => {
      const mac = randomMac();
      expect(mac).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
    });
  });

  describe('数据脱敏', () => {
    test('maskPhone 应该正确脱敏手机号', () => {
      expect(maskPhone('13800138000')).toBe('138****8000');
      expect(maskPhone('123')).toBe('123');
    });

    test('maskEmail 应该正确脱敏邮箱', () => {
      expect(maskEmail('test@example.com')).toBe('te***t@example.com');
      expect(maskEmail('invalid')).toBe('invalid');
    });
  });

  describe('时间处理', () => {
    test('timestamp 应该返回当前时间戳', () => {
      const ts = timestamp();
      expect(typeof ts).toBe('number');
      expect(ts).toBeGreaterThan(0);
    });

    test('timestampToDate 应该正确转换时间戳', () => {
      const ts = 1640692800; // 2021-12-28 16:00:00
      const date = timestampToDate(ts);
      expect(date).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });

    test('dateToTimestamp 应该正确转换日期', () => {
      const date = '2021-12-28 16:00:00';
      const ts = dateToTimestamp(date);
      expect(typeof ts).toBe('number');
      expect(ts).toBe(1640692800);
    });

    test('currentDate 应该返回当前日期', () => {
      const date = currentDate();
      expect(date).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    test('currentTime 应该返回当前时间', () => {
      const time = currentTime();
      expect(time).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    test('currentDateTime 应该返回当前日期时间', () => {
      const datetime = currentDateTime();
      expect(datetime).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });
  });

  describe('加密解密', () => {
    test('md5 应该正确加密字符串', () => {
      const hash = md5('hello');
      expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    test('sha1 应该正确加密字符串', () => {
      const hash = sha1('hello');
      expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });

    test('sha256 应该正确加密字符串', () => {
      const hash = sha256('hello');
      expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    test('base64Encode 应该正确编码', () => {
      const encoded = base64Encode('hello');
      expect(encoded).toBe('aGVsbG8=');
    });

    test('base64Decode 应该正确解码', () => {
      const decoded = base64Decode('aGVsbG8=');
      expect(decoded).toBe('hello');
    });
  });

  describe('数据验证', () => {
    test('isEmpty 应该正确判断是否为空', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    test('isJson 应该正确判断是否为 JSON 字符串', () => {
      expect(isJson('{"a":1}')).toBe(true);
      expect(isJson('[1,2,3]')).toBe(true);
      expect(isJson('"hello"')).toBe(true);
      expect(isJson('hello')).toBe(false);
      expect(isJson('')).toBe(false);
    });
  });

  describe('数组操作', () => {
    test('unique 应该去重', () => {
      const arr = [1, 2, 2, 3, 3, 3];
      expect(unique(arr)).toEqual([1, 2, 3]);
    });

    test('groupBy 应该分组', () => {
      const arr = [
        { id: 1, type: 'a' },
        { id: 2, type: 'b' },
        { id: 3, type: 'a' },
      ];
      const grouped = groupBy(arr, 'type');
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });

    test('sortBy 应该排序', () => {
      const arr = [
        { id: 3, name: 'c' },
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];
      const sorted = sortBy(arr, 'id', 'asc');
      expect(sorted[0].id).toBe(1);
      expect(sorted[2].id).toBe(3);
    });

    test('randomItem 应该返回随机元素', () => {
      const arr = [1, 2, 3, 4, 5];
      const item = randomItem(arr);
      expect(arr).toContain(item);
    });

    test('shuffle 应该打乱数组', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled).toEqual(expect.arrayContaining(arr));
    });
  });

  describe('深度克隆', () => {
    test('deepClone 应该正确克隆对象', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    test('deepClone 应该正确克隆数组', () => {
      const arr = [1, [2, 3]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
    });
  });
});