
class Post
  def initialize(filename)
    @filename = filename
  end

  def rawcontents
    @rawcontents ||= File.read(@filename)
  end

  def rawfrontmatter
    @rawfrontmatter ||= rawcontents.split('---')[1]
  end

  def rawinside
    @rawinside ||= rawcontents.split('---',3)[2].gsub(/{% img(.+?)%}/, '<img src="\1" class="img-responsive"/>')

  end

  def frontmatter
    @frontmatter ||= YAML.unsafe_load(rawfrontmatter)
  end

  def date
    toks = @filename.split('/')[1].split('-')

    res = Time.new(toks[0].to_i, toks[1].to_i, toks[2].to_i)

    if frontmatter['date']
      res = frontmatter['date']
      if res.is_a? String
        res = Time.parse(frontmatter['date'])
      end
    end
    res
  end

  def categories
    frontmatter['categories']
  end

  def tags
    (frontmatter['tags'] || []).map {|x| x.downcase}
  end

  def title
    frontmatter['title']
  end

  def content
    markdown = Redcarpet::Markdown.new(
      Redcarpet::Render::HTML,
      autolink: true,
      tables: true,
      fenced_code_blocks: true
    )


    markdown.render(rawinside).sub(/<p>([A-Z])/, '<p><span class="dropcap">\1</span>')
  end

  def short_content
    markdown = Redcarpet::Markdown.new(
      Redcarpet::Render::HTML,
      autolink: true,
      tables: true,
      fenced_code_blocks: true
    )

    markdown.render(rawinside[0..300] + '...')
  end

  def page_path
    dpart = @filename.split('/')[1].split('.')[0].split('-')[0..2].join('/')
    apart = @filename.split('/')[1].split('.')[0].split('-')[3..-1].join('-')

    [dpart, apart].join('/')
  end

  def year
    "#{date.year}"
  end

  def year_month
    "#{date.year}/#{date.month.to_s.rjust(2, '0')}"
  end

  def year_month_day
    "#{date.year}/#{date.month.to_s.rjust(2, '0')}/#{date.day.to_s.rjust(2, '0')}"
  end

  def published
    frontmatter['published'] == true || frontmatter['published'].nil?
  end

end
