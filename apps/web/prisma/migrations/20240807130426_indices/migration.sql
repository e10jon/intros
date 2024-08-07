-- CreateIndex
CREATE INDEX "Profile_name_idx" ON "Profile" USING GIST ("name" gist_trgm_ops);

-- CreateIndex
CREATE INDEX "Profile_title_idx" ON "Profile" USING GIST ("title" gist_trgm_ops);

-- CreateIndex
CREATE INDEX "Profile_bio_idx" ON "Profile" USING GIST ("bio" gist_trgm_ops);

-- CreateIndex
CREATE INDEX "Profile_interests_idx" ON "Profile" USING GIST ("interests" gist_trgm_ops);

-- CreateIndex
CREATE INDEX "Profile_country_province_idx" ON "Profile"("country", "province");
