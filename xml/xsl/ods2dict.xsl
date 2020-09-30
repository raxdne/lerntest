<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cxp="http://www.tenbusch.info/cxproc/" xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" xmlns:presentation="urn:oasis:names:tc:opendocument:xmlns:presentation:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0" xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0" xmlns:math="http://www.w3.org/1998/Math/MathML" xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0" xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0" xmlns:ooo="http://openoffice.org/2004/office" xmlns:ooow="http://openoffice.org/2004/writer" xmlns:oooc="http://openoffice.org/2004/calc" xmlns:dom="http://www.w3.org/2001/xml-events" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:rpt="http://openoffice.org/2005/report" xmlns:of="urn:oasis:names:tc:opendocument:xmlns:of:1.2" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:grddl="http://www.w3.org/2003/g/data-view#" xmlns:tableooo="http://openoffice.org/2009/table" xmlns:field="urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0" xmlns:formx="urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0" xmlns:css3t="http://www.w3.org/TR/css3-text/" office:version="1.2" grddl:transformation="http://docs.oasis-open.org/office/1.2/xslt/odf2rdf.xsl" version="1.0">
  <!--  -->
  <xsl:output method="xml" encoding="UTF-8"/>
  <xsl:variable name="str_sep" select="'|'"/>
  <xsl:variable name="str_lang_a" select="'de'"/>
  <xsl:variable name="str_lang_b" select="'fr'"/>
  <xsl:variable name="cols" select="'1,2'"/>
  <xsl:template match="/">
    <xsl:element name="dictionary">
      <xsl:element name="title">
        <xsl:choose>
          <xsl:when test="$str_lang_a='en'">
            <xsl:text>English</xsl:text>
          </xsl:when>
          <xsl:when test="$str_lang_a='es'">
            <xsl:text>Español</xsl:text>
          </xsl:when>
          <xsl:when test="$str_lang_a='fr'">
            <xsl:text>Français</xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text>Deutsch</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:text>--</xsl:text>
        <xsl:choose>
          <xsl:when test="$str_lang_b='en'">
            <xsl:text>English</xsl:text>
          </xsl:when>
          <xsl:when test="$str_lang_b='es'">
            <xsl:text>Español</xsl:text>
          </xsl:when>
          <xsl:when test="$str_lang_b='fr'">
            <xsl:text>Français</xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text>Deutsch</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:element>
      <xsl:apply-templates select="//office:document-content/office:body/office:spreadsheet/table:table|//table[count(tr[td]) &gt; 0]"/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="table:table">
    <xsl:element name="lesson">
      <xsl:element name="name">
        <xsl:value-of select="@table:name"/>
      </xsl:element>
      <xsl:for-each select="table:table-row[table:table-cell[1]/text:p and table:table-cell[2]/text:p]">
        <xsl:element name="entry">
          <xsl:call-template name="SPLITCELL">
            <xsl:with-param name="StringLang">
              <xsl:value-of select="$str_lang_a"/>
            </xsl:with-param>
            <xsl:with-param name="StringToTransform">
              <xsl:value-of select="table:table-cell[number(substring-before($cols,','))]/text:p"/>
            </xsl:with-param>
          </xsl:call-template>
          <xsl:call-template name="SPLITCELL">
            <xsl:with-param name="StringLang">
              <xsl:value-of select="$str_lang_b"/>
            </xsl:with-param>
            <xsl:with-param name="StringToTransform">
              <xsl:value-of select="table:table-cell[number(substring-after($cols,','))]/text:p"/>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:element>
      </xsl:for-each>
    </xsl:element>
  </xsl:template>
  <xsl:template match="table">
    <xsl:element name="lesson">
      <xsl:element name="name">
        <xsl:value-of select="tr[1]/td[1]"/>
      </xsl:element>
      <xsl:for-each select="tr[position() &gt; 1 and count(td) &gt; 1]">
        <xsl:element name="entry">
          <xsl:call-template name="SPLITCELL">
            <xsl:with-param name="StringLang">
              <xsl:value-of select="$str_lang_a"/>
            </xsl:with-param>
            <xsl:with-param name="StringToTransform">
              <xsl:value-of select="td[number(substring-before($cols,','))]"/>
            </xsl:with-param>
          </xsl:call-template>
          <xsl:call-template name="SPLITCELL">
            <xsl:with-param name="StringLang">
              <xsl:value-of select="$str_lang_b"/>
            </xsl:with-param>
            <xsl:with-param name="StringToTransform">
              <xsl:value-of select="td[number(substring-after($cols,','))]"/>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:element>
      </xsl:for-each>
    </xsl:element>
  </xsl:template>
  <xsl:template match="*"/>
  <xsl:template name="SPLITCELL">
    <xsl:param name="StringLang"/>
    <xsl:param name="StringToTransform"/>
    <xsl:choose>
      <!-- string contains split char $str_sep -->
      <xsl:when test="contains($StringToTransform,$str_sep)">
        <xsl:element name="{$StringLang}">
          <xsl:value-of select="normalize-space(substring-before($StringToTransform,$str_sep))"/>
        </xsl:element>
        <!-- repeat for the remainder of the original string -->
        <xsl:call-template name="SPLITCELL">
          <xsl:with-param name="StringLang">
            <xsl:value-of select="$StringLang"/>
          </xsl:with-param>
          <xsl:with-param name="StringToTransform">
            <xsl:value-of select="substring-after($StringToTransform,$str_sep)"/>
          </xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <!-- string does not contain newline, so just output it -->
      <xsl:otherwise>
        <xsl:element name="{$StringLang}">
          <xsl:value-of select="normalize-space($StringToTransform)"/>
        </xsl:element>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
