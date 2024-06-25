-- 1. `memberNumber` フィールドを追加
ALTER TABLE "User" ADD COLUMN "memberNumber" INTEGER;

-- 2. 既存の行に対してランダムな8桁の番号を生成して設定
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM "User"
  LOOP
    UPDATE "User"
    SET "memberNumber" = (FLOOR(RANDOM() * 90000000) + 10000000)::INT
    WHERE id = rec.id;
  END LOOP;
END $$;

-- 3. `memberNumber` フィールドを NOT NULL 制約付きに変更
ALTER TABLE "User" ALTER COLUMN "memberNumber" SET NOT NULL;

-- 4. `memberNumber` フィールドにユニーク制約を追加
ALTER TABLE "User" ADD CONSTRAINT "User_memberNumber_unique" UNIQUE ("memberNumber");
