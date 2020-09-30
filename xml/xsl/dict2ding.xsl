<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cxp="http://www.tenbusch.info/cxproc/" version="1.0">
  <!--  -->
  <xsl:variable name="str_lang_a" select="'de'"/>
  <xsl:variable name="str_lang_b" select="'fr'"/>
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="dictionary">
    <!-- <xsl:value-of select="concat('&quot;',title,'&quot;')"/> -->
    <xsl:apply-templates select="//entry"/>
  </xsl:template>
  <xsl:template match="entry">
    <xsl:for-each select="*[name()=$str_lang_a]">
      <xsl:if test="position() &gt; 1">
        <xsl:text>|</xsl:text>
      </xsl:if>
      <xsl:value-of select="normalize-space(.)"/>
    </xsl:for-each>
    <xsl:text> :: </xsl:text>
    <xsl:for-each select="*[name()=$str_lang_b]">
      <xsl:if test="position() &gt; 1">
        <xsl:text>|</xsl:text>
      </xsl:if>
      <xsl:value-of select="normalize-space(.)"/>
    </xsl:for-each>
    <xsl:text>
</xsl:text>
  </xsl:template>
  <xsl:template match="*"/>
</xsl:stylesheet>
