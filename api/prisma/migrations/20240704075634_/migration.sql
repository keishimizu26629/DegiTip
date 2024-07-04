-- emailVerifyTokenカラムを追加
ALTER TABLE "User" ADD COLUMN "emailVerifyToken" TEXT;

-- 既存のデータに対してemailVerifyTokenを生成 (PostgreSQLの場合)
DO $$
DECLARE
  rec RECORD;
  token TEXT;
BEGIN
  FOR rec IN SELECT id FROM "User" LOOP
    token := SUBSTRING(MD5(RANDOM()::TEXT), 1, 36); -- 36文字のランダムな英数字を生成
    UPDATE "User" SET "emailVerifyToken" = token WHERE id = rec.id;
  END LOOP;
END $$;

-- emailVerifyTokenカラムをNOT NULL制約に追加
ALTER TABLE "User" ALTER COLUMN "emailVerifyToken" SET NOT NULL;
