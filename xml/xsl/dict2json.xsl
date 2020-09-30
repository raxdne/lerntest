<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cxp="http://www.tenbusch.info/cxproc/" version="1.0">
  <!--  -->
  <xsl:variable name="str_lang_a" select="'de'"/>
  <xsl:variable name="str_lang_b" select="'fr'"/>
  <xsl:variable name="int_lesson" select="0"/>
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/">
    <xsl:text>[</xsl:text>
    <xsl:apply-templates/>
    <xsl:text>]</xsl:text>
  </xsl:template>
  <xsl:template match="dictionary">
    <xsl:choose>
      <xsl:when test="$int_lesson &gt; 0">
        <xsl:value-of select="concat('&quot;',title,' ',$int_lesson,'&quot;')"/>
        <xsl:value-of select="concat(',',' [')"/>
        <xsl:apply-templates select="lesson[position()=$int_lesson]/entry"/>
        <xsl:text>]</xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat('&quot;',title,' all','&quot;')"/>
        <xsl:value-of select="concat(',',' [')"/>
        <xsl:apply-templates select="//entry"/>
        <xsl:text>]</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template match="entry">
    <xsl:choose>
      <xsl:when test="$str_lang_a">
        <xsl:if test="position() &gt; 1">
          <xsl:text>,</xsl:text>
        </xsl:if>
        <xsl:text>{arrV : </xsl:text>
        <xsl:text>[</xsl:text>
        <xsl:for-each select="*[name()=$str_lang_a]">
          <xsl:if test="position() &gt; 1">
            <xsl:text>,</xsl:text>
          </xsl:if>
          <xsl:value-of select="concat('&quot;',normalize-space(.),'&quot;')"/>
        </xsl:for-each>
        <xsl:text>], arrAnswer : [</xsl:text>
        <xsl:for-each select="*[name()=$str_lang_b]">
          <xsl:if test="position() &gt; 1">
            <xsl:text>,</xsl:text>
          </xsl:if>
          <xsl:value-of select="concat('&quot;',normalize-space(.),'&quot;')"/>
        </xsl:for-each>
        <xsl:text>]</xsl:text>
        <xsl:text>}</xsl:text>
      </xsl:when>
      <xsl:otherwise>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template match="*"/>
</xsl:stylesheet>
