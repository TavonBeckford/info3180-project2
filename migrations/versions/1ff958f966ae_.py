"""empty message

Revision ID: 1ff958f966ae
Revises: 93303f66433c
Create Date: 2021-04-19 20:54:03.619106

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ff958f966ae'
down_revision = '93303f66433c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Cars',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=1000), nullable=False),
    sa.Column('make', sa.String(length=80), nullable=False),
    sa.Column('model', sa.String(length=80), nullable=False),
    sa.Column('colour', sa.String(length=80), nullable=False),
    sa.Column('year', sa.String(length=80), nullable=False),
    sa.Column('transmission', sa.String(length=80), nullable=False),
    sa.Column('car_type', sa.String(length=100), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('photo', sa.String(length=200), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Cars')
    # ### end Alembic commands ###